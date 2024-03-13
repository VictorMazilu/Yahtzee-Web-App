using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace YahtzeeEndpoints.Controllers
{
    public class SessionController : ApiController
    {
        [HttpPost]
        [Route("api/session/start")]
        public HttpResponseMessage StartSession()
        {
            var resp = new HttpResponseMessage();

            var cookie = new CookieHeaderValue("sessionId", Guid.NewGuid().ToString());
            cookie.Expires = DateTimeOffset.Now.AddDays(1);
            cookie.Domain = Request.RequestUri.Host;
            cookie.Path = "/";

            resp.Headers.AddCookies(new CookieHeaderValue[] { cookie });
            resp.StatusCode = HttpStatusCode.OK;
            return resp;
        }

        [HttpGet]
        [Route("api/session/end")]
        public IHttpActionResult EndSession()
        {
            // Clear the session ID cookie
            var cookie = new HttpCookie("sessionId")
            {
                Expires = DateTime.Now.AddDays(-1)
            };
            HttpContext.Current.Response.Cookies.Add(cookie);

            return Ok("Session ended");
        }
    }
}
