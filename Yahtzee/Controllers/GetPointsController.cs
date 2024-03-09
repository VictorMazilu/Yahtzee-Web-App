using Emgu.CV;
using Emgu.CV.CvEnum;
using Emgu.CV.Structure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Http;
using YamsForm;

namespace Yahtzee.Controllers
{
    public class GetPointsController : ApiController
    {
        public HttpResponseMessage Get()
        {
            // Read the image bytes from the file
            var sessionId = HttpContext.Current.Request.Cookies["sessionId"]?.Value;
            byte[] imageBytes = (byte[])HttpContext.Current.Application[sessionId + "-image"];
            Emgu.CV.Mat processedImage = PointsUtils.ConvertToMat(imageBytes);
            (Dictionary<int,int> dices, Dictionary<int, Mat> images) = RecognitionSystem.Recognize(processedImage);



            // Convert the image bytes to a base64 string
            Dictionary<int, Image<Bgra, byte>> finalImages = new Dictionary<int, Image<Bgra, byte>>();
            foreach (KeyValuePair<int, Mat> image in images) {
                Image<Bgra, byte> imageProcessed = image.Value.ToImage<Bgra, byte>();
                //byte[] imageProcessed = PointsUtils.ConvertToByteArray(image.Value);
                finalImages.Add(image.Key, imageProcessed);
            }

            // Create the response message
            var response = new
            {
                message = "My message",
                imageBase64 = finalImages
            };

            return Request.CreateResponse(HttpStatusCode.OK, dices);
        }

        public static class PointsUtils {
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
                    // Decode the byte array into a bitmap
                    using (MemoryStream memoryStream = new MemoryStream(byteArray))
                    {
                        Bitmap bitmap = new Bitmap(memoryStream);

                        // Convert the bitmap to a Mat
                        Mat mat = new Mat();

                        // Convert the bitmap to an EmguCV image
                        Image<Emgu.CV.Structure.Bgr, byte> image = new Image<Emgu.CV.Structure.Bgr, byte>(bitmap);

                        // Convert the EmguCV image to a Mat
                        mat = image.Mat;

                        return mat;
                    }
                }
                catch (Exception ex)
                {
                    // Handle exceptions
                    Console.WriteLine("Error converting byte array to Mat: " + ex.Message);
                    return null;
                }
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
}
