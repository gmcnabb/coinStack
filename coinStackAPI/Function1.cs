using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Text;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using System.Linq;

namespace coinStackAPI
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "test")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            //string name = req.Query["name"];

            //string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //dynamic data = JsonConvert.DeserializeObject(requestBody);
            //name = name ?? data?.name;

            //string responseMessage = string.IsNullOrEmpty(name)
            //    ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
            //    : $"Hello, {name}. This HTTP triggered function executed successfully.";

            //return new OkObjectResult(responseMessage);

            ClaimsPrincipal UserClaims = StaticWebAppsAuth.Parse(req);
            string responseMessage = UserClaims.Identity.ToString();

            return new OkObjectResult(responseMessage);
        }

        //[FunctionName("Restricted")]
        //public static async Task<IActionResult> Restricted(
        //    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "authed")] HttpRequest req, ILogger log)
        //{
        //    string responseMessage = "you an MVP";
        //    return new OkObjectResult(responseMessage);
        //}

        public static class StaticWebAppsAuth
        {
            public class ClientPrincipal
            {
                public string IdentityProvider { get; set; }
                public string UserId { get; set; }
                public string UserDetails { get; set; }
                public IEnumerable<string> UserRoles { get; set; }
            }

            public static ClaimsPrincipal Parse(HttpRequest req)
            {
                var principal = new ClientPrincipal();

                if (req.Headers.TryGetValue("x-ms-client-principal", out var header))
                {
                    var data = header[0];
                    var decoded = Convert.FromBase64String(data);
                    var json = Encoding.ASCII.GetString(decoded);
                    principal = System.Text.Json.JsonSerializer.Deserialize<ClientPrincipal>
                        (json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }

                principal.UserRoles = principal.UserRoles?.Except(new string[] { "anonymous" },
                    StringComparer.CurrentCultureIgnoreCase);

                if (!principal.UserRoles?.Any() ?? true)
                {
                    return new ClaimsPrincipal();
                }

                var identity = new ClaimsIdentity(principal.IdentityProvider);
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, principal.UserId));
                identity.AddClaim(new Claim(ClaimTypes.Name, principal.UserDetails));
                identity.AddClaims(principal.UserRoles.Select(r => new Claim(ClaimTypes.Role, r)));

                return new ClaimsPrincipal(identity);
            }
        }

    }
}
