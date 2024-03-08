using Newtonsoft.Json;
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
