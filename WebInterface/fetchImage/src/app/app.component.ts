import { Component } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';
import { prodEnvironment } from '../config/environment.prod';
import TokenStore from './session/token';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public returnedImage: any;
  public userLoggedIn = false;

  private trigger: Subject<any> = new Subject();

  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();

  dataMap: { [key: number]: number } = {};

  captureImage = '';
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }
  receiveMessage(logged: boolean) {
    this.userLoggedIn = logged;
  }


  isEmptyObject(obj: { [key: string]: any }): boolean {
    return dictSize(obj);
  }
  /*------------------------------------------
  --------------------------------------------
  set the session cookie
  --------------------------------------------
  --------------------------------------------*/
  setCookie(name: string, value: string | null, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

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

    const imageData = this.webcamImage.imageAsBase64;
    const blobl = this.convertBase64ToBlob(imageData, 'image/jpeg');
    const imageFile = new File([blobl], 'webcam_image.jpg', { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = TokenStore.getToken();
    this.http.post<any>(prodEnvironment.apiUrl + 'sendimage', formData, {headers: new HttpHeaders({'Authorization': `Bearer ${token}` }) })
      .subscribe(
        response => {
          console.log('Response from server:', response);
          this.http.get<any>(prodEnvironment.apiUrl + 'getpoints', {headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) })
            .subscribe(
              response => {
                this.dataMap = response;
              }, error => {
                console.error('Error:', error);
              });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }
  convertBlobToDataURL(blob: Blob): String {
    let image = new String();
    const reader = new FileReader();
    reader.onloadend = () => {
      image = reader.result as string;
    };
    reader.readAsDataURL(blob);
    return image;
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

  base64ToByteArray(base64String: string): Uint8Array {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64String.split(',')[1] || base64String;

    // Decode the base64 string
    const binaryString = atob(base64WithoutPrefix);

    // Create a Uint8Array to hold the decoded bytes
    const byteArray = new Uint8Array(binaryString.length);

    // Fill the Uint8Array with decoded bytes
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    return byteArray;
  }
}
function dictSize(obj: { [key: string]: any; }): boolean {
  throw new Error('Function not implemented.');
}

