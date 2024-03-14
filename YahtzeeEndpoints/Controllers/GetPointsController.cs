using Emgu.CV;
using Emgu.CV.CvEnum;
using Emgu.CV.Structure;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http;
using YahtzeeAPI.Recognition;
using YahtzeeEndpoints.Models;

namespace YahtzeeEndpoints.Controllers
{
    public class GetPointsController : ApiController
    {
        public HttpResponseMessage Get()
        {
            AuthenticationHeaderValue header = Request.Headers.Authorization;
            if (UserData.UserImages.ContainsKey(header.Parameter))
            {
                Dictionary<int, Dictionary<int, int>> dicesDict = new Dictionary<int, Dictionary<int, int>>();
                // Read the image bytes from the file
                for (int i = 0; i < 10; i++)
                {
                    byte[] imageBytes = (byte[])UserData.UserImages[header.Parameter + i];
                    Emgu.CV.Mat processedImage = PointsUtils.ConvertToMat(imageBytes);
                    Dictionary<int, int> dices = RecognitionSystem.Recognize(processedImage);
                    dicesDict.Add(i, dices);
                }

                List<int> dicesList = new List<int>();
                foreach (KeyValuePair<int,int> dice in dicesDict[0])
                {
                    dicesList.Add(dice.Value);
                }
                // Create the response message
                var response = new
                {
                    message = dicesList //only send the first processed output for now
                };

                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, new Exception("No dices for today"));
        }

        
    }
    public static class PointsUtils
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
        public static byte[] ConvertToByteArray(Mat mat)
        {
            // Check if the Mat is empty or null
            if (mat == null || mat.IsEmpty)
            {
                return null;
            }

            // Get the number of bytes needed to store the Mat data
            int bytesNeeded = mat.Width * mat.Height * mat.NumberOfChannels;

            // Create a byte array to hold the Mat data
            byte[] byteArray = new byte[bytesNeeded];

            // Copy the Mat data to the byte array
            Marshal.Copy(mat.DataPointer, byteArray, 0, bytesNeeded);

            return byteArray;
        }
        public static Mat ConvertToMat(byte[] byteArray)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream(byteArray))
                {
                    Bitmap bitmap = new Bitmap(ms);
                    return BitmapToMat(bitmap);
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                Console.WriteLine("Error converting byte array to Mat: " + ex.Message);
                return null;
            }
        }
        public static Mat BitmapToMat(Bitmap bitmap)
        {
            // Convert Bitmap to byte array
            Rectangle rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
            BitmapData bmpData = bitmap.LockBits(rect, ImageLockMode.ReadOnly, bitmap.PixelFormat);
            IntPtr ptr = bmpData.Scan0;
            int numBytes = bmpData.Stride * bitmap.Height;
            byte[] imageData = new byte[numBytes];
            Marshal.Copy(ptr, imageData, 0, numBytes);
            bitmap.UnlockBits(bmpData);

            // Get the number of channels
            int channels = Image.GetPixelFormatSize(bitmap.PixelFormat) / 8;

            // Create Mat from byte array
            Mat mat = new Mat(bitmap.Height, bitmap.Width, DepthType.Cv8U, channels);
            mat.SetTo(imageData);

            return mat;
        }
        public static Mat ResizeWithAspectRatio(Mat inputImage, int newWidth, int newHeight)
        {
            Mat outputImage = new Mat();

            double widthRatio = (double)newWidth / inputImage.Width;
            double heightRatio = (double)newHeight / inputImage.Height;

            double scale = Math.Min(widthRatio, heightRatio);

            int scaledWidth = (int)(inputImage.Width * scale);
            int scaledHeight = (int)(inputImage.Height * scale);

            CvInvoke.Resize(inputImage, outputImage, new Size(scaledWidth, scaledHeight), interpolation: Inter.Linear);

            return outputImage;
        }
    }
}
