using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace Yahtzee.Controllers
{
    public class SessionController : ApiController
    {

        [HttpPost]
        [Route("api/session/start")]
        public HttpResponseMessage StartSession()
        {
            //// Generate a unique session ID
            //string sessionId = Guid.NewGuid().ToString();

            //// Store the session ID in a cookie
            //var cookie = new HttpCookie("sessionId", sessionId);
            //HttpContext.Current.Response.Cookies.Add(cookie);

            //return Ok(sessionId);

            var resp = new HttpResponseMessage();

            var cookie = new CookieHeaderValue("sessionId", Guid.NewGuid().ToString());
            cookie.Expires = DateTimeOffset.Now.AddDays(1);
            cookie.Domain = Request.RequestUri.Host;
            cookie.Path = "/";

            resp.Headers.AddCookies(new CookieHeaderValue[] { cookie });
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
