import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private trigger: Subject<any> = new Subject();

  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();

  captureImage  = '';
  constructor(private http: HttpClient) { }
  ngOnInit() {}

  /*------------------------------------------
  --------------------------------------------
  triggerSnapshot()
  --------------------------------------------
  --------------------------------------------*/
  public triggerSnapshot(): void {
      this.trigger.next(true);
  }

  /*------------------------------------------
  --------------------------------------------
  handleImage()
  --------------------------------------------
  --------------------------------------------*/
  public handleImage(webcamImage: WebcamImage): void {
      this.webcamImage = webcamImage;
      this.captureImage = webcamImage!.imageAsDataUrl;

      const data = webcamImage;

    const imageData = this.webcamImage.imageAsBase64;
    const blobl = this.convertBase64ToBlob(imageData, 'image/jpeg');
    const imageFile = new File([blobl], 'webcam_image.jpg', { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('image', imageFile);

    this.http.post<any>('http://localhost:53097//api/sendimage', formData)
      .subscribe(
        response => {
          console.log('Response from server:', response);
          // Handle response as needed
        },
        error => {
          console.error('Error:', error);
          // Handle error
        }
      );
  }

  convertBase64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/png' });
  }

  /*------------------------------------------
  --------------------------------------------
  triggerObservable()
  --------------------------------------------
  --------------------------------------------*/
  public get triggerObservable(): Observable<any> {

      return this.trigger.asObservable();
  }

  /*------------------------------------------
  --------------------------------------------
  nextWebcamObservable()
  --------------------------------------------
  --------------------------------------------*/
  public get nextWebcamObservable(): Observable<any> {

      return this.nextWebcam.asObservable();
  }
}
