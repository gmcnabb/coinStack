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
using static coinStackAPI.Function1.SimpleAuth;

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
            string responseMessage = UserClaims.Identity.Name;

            return new OkObjectResult(responseMessage);
        }

        [FunctionName("ReadWatchlist")]
        public static async Task<IActionResult> ReadWatchlist(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ReadWatchlist/{partitionKey}/")] HttpRequest req,
            [CosmosDB(
                databaseName: "coinstackdb1",
                collectionName: "watchlists",
                PartitionKey = "{partitionKey}",
                ConnectionStringSetting = "DB_READ_CONNECTION")] IEnumerable<WatchlistEntry> WatchlistEntries,
            ILogger log)
        {
            log.LogInformation("attempting to read from watchlists");
            try
            {
                ClientPrincipal principal = SimpleAuth.Parse(req);
                if (principal.UserId != null)
                {
                    return new OkObjectResult(WatchlistEntries.Where(w => w.userId == principal.UserId));
                }
                else
                {
                    return new OkObjectResult("No watchlist found for this user. Are you logged in?");
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Couldn't insert item. Exception thrown: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [FunctionName("WriteToWatchlist")]
        public static async Task<IActionResult> WriteToWatchlist(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "WriteToWatchlist")] HttpRequest req,
            [CosmosDB(
                databaseName: "coinstackdb1",
                collectionName: "watchlists",
                ConnectionStringSetting = "DB_READ_WRITE_CONNECTION")] IAsyncCollector<WatchlistEntry> WatchlistEntries,
            ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                WatchlistEntry newEntry = JsonConvert.DeserializeObject<WatchlistEntry>(requestBody);

                await WatchlistEntries.AddAsync(newEntry);

                return new OkObjectResult(newEntry);
            }
            catch (Exception ex)
            {
                log.LogError($"Couldn't insert item. Exception thrown: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        public class WatchlistEntry
        {
            public WatchlistEntry(string[] coinIds, string id)
            {
                this.values = coinIds;
                this.userId = id;
            }
            public string[] values { get; set; }
            public string userId { get; set; }
        }

        public static class SimpleAuth
        {
            public class ClientPrincipal
            {
                public string IdentityProvider { get; set; }
                public string UserId { get; set; }
                public string UserDetails { get; set; }
                public IEnumerable<string> UserRoles { get; set; }
            }

            public static ClientPrincipal Parse(HttpRequest req)
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

                return principal;
            }
        }

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
    //[FunctionName("Restricted")]N
    //public static async Task<IActionResult> Restricted(
    //    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "authed")] HttpRequest req, ILogger log)
    //{
    //    string responseMessage = "you an MVP";
    //    return new OkObjectResult(responseMessage);
    //}

    //[FunctionName("ReadFromDB")]
    //public static IActionResult Read(
    //    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "read/{partitionKey}/{entry}")]
    //    HttpRequest req, [CosmosDB(
    //                        databaseName: "coinstackdb1",
    //                        collectionName: "portfolios",
    //                        ConnectionStringSetting = "DB_READ_CONNECTION",
    //                        Id = "{entry}",
    //                        PartitionKey = "{partitionKey}")] PortfolioEntry valueOne, ILogger log)
    //{
    //    log.LogInformation("attempting read from DB");

    //    if (valueOne == null)
    //    {
    //        log.LogInformation("not found");
    //    }
    //    else
    //    {
    //        log.LogInformation($"found item, description: {valueOne.value}");
    //    }

    //    string responseMessage = valueOne.values ?? "fail";
    //    return new OkObjectResult(responseMessage);

    //}
}
