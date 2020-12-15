using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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

            //string responseMessage = "successful API auth test";
            string responseMessage = req.Headers.Values.ToString();
            return new OkObjectResult(responseMessage);
        }

        //[FunctionName("Restricted")]
        //public static async Task<IActionResult> Restricted(
        //    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "authed")] HttpRequest req, ILogger log)
        //{
        //    string responseMessage = "you an MVP";
        //    return new OkObjectResult(responseMessage);
        //}
    }
}
