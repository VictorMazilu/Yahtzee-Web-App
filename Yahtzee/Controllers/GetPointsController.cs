using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Yahtzee.Controllers
{
    public class GetPointsController : ApiController
    {
        public IHttpActionResult Get()
        {
            return Ok(JsonConvert.SerializeObject("This is a message from the counting system", Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
        }
    }
}
