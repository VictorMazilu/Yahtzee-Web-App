using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using YahtzeeEndpoints.Models;

namespace YahtzeeEndpoints.Controllers
{
    public class ImageData
    {
        public string Image { get; set; }
    }
    public class SendImageController : ApiController
    {
        public object StandardCharsets { get; private set; }

        [HttpPost]
        [Route("api/sendimage")]
        public async Task<IHttpActionResult> UploadImage()
        {
            // Check if the request contains multipart/form-data
            if (!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest("Unsupported media type");
            }

            // Create a provider to handle the multipart/form-data
            var provider = new MultipartFormDataStreamProvider(HttpContext.Current.Server.MapPath("~/App_Data"));

            try
            {
                // Read the form data and get the file
                await Request.Content.ReadAsMultipartAsync(provider);

                // Get the file from the provider
                Collection<MultipartFileData> file = provider.FileData;
                AuthenticationHeaderValue header = Request.Headers.Authorization;
                if (UserData.UserImages.ContainsKey(header.Parameter))
                {
                    int indexN0 = 0;
                    foreach (MultipartFileData coll in file)
                    {
                        // Convert string to byte array using UTF-8 encoding
                        byte[] byteArray = File.ReadAllBytes(coll.LocalFileName);
                        UserData.UserImages[header.Parameter + indexN0++] = byteArray;
                    }
                    
                    return Ok("files received");
                }
            }
            catch (System.Exception ex)
            {
                return InternalServerError(ex);
            }

            return Ok("no file");
        }
    }
    public static class Utils
    {
        public static string GetCookieValue(this HttpRequestHeaders requestHeaders, string cookieName)
        {
            foreach (var header in requestHeaders)
            {
                if (header.Key.Equals("Cookie", StringComparison.InvariantCultureIgnoreCase) == false)
                    continue;

                var cookiesHeaderValue = header.Value.FirstOrDefault();
                if (cookiesHeaderValue == null)
                    return null;

                var cookieCollection = cookiesHeaderValue.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var cookieNameValue in cookieCollection)
                {
                    var parts = cookieNameValue.Split(new[] { '=' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length != 2) continue;
                    if (parts[0].Trim().Equals(cookieName, StringComparison.InvariantCultureIgnoreCase))
                        return parts[1].Trim();
                }
            }

            return null;
        }
        public static FileInfo CreateFile(byte[] bytes, string filePath)
        {
            try
            {
                // Write the byte array to the specified file path
                File.WriteAllBytes(filePath, bytes);

                // Create a FileInfo object representing the file
                FileInfo fileInfo = new FileInfo(filePath);

                return fileInfo;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
                return null;
            }
        }
        public static byte[] ConvertBlobToFormattedPng(byte[] blobPngByteArray)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream(blobPngByteArray))
                {
                    // Create a Bitmap object from the MemoryStream
                    Bitmap bmp = new Bitmap(ms);

                    // Create a new MemoryStream to store the formatted PNG image
                    MemoryStream formattedMs = new MemoryStream();

                    // Save the Bitmap to the MemoryStream as PNG
                    bmp.Save(formattedMs, System.Drawing.Imaging.ImageFormat.Png);

                    // Convert the MemoryStream to a byte array
                    byte[] formattedPngByteArray = formattedMs.ToArray();

                    return formattedPngByteArray;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error converting blob PNG to formatted PNG: " + ex.Message);
                return null;
            }
        }
        public static NameValueCollection Convert(this FormDataCollection formDataCollection)
        {
            IEnumerator<KeyValuePair<string, string>> pairs = formDataCollection.GetEnumerator();

            NameValueCollection collection = new NameValueCollection();

            while (pairs.MoveNext())
            {
                KeyValuePair<string, string> pair = pairs.Current;
                collection.Add(pair.Key, pair.Value);
            }

            return collection;
        }

        public static Image ByteArrayToImage(byte[] byteArray)
        {
            if (byteArray == null || byteArray.Length == 0)
                return null;

            try
            {
                using (MemoryStream memoryStream = new MemoryStream(byteArray))
                {
                    Image image = Image.FromStream(memoryStream);
                    return image;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error converting byte array to image: " + ex.Message);
                return null;
            }
        }
    }
}
