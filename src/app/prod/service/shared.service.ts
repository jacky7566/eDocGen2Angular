import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'text/plain'
  });
  private postHttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  });

  private postHttpOptions : Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    }),
    responseType: 'text'
  };
  private downloadHttpOptions : Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    }),
    responseType: 'application/octet-stream '
  };
  private httpOptions = { headers: this.httpHeaders };

  constructor(private http: HttpClient) { }

  public getObject(resourcePath: string = '') {
    this.httpOptions = { headers: this.httpHeaders };
    const url = environment.apiUrl + resourcePath;
    // console.log(url);
    return this.http.get<any>(environment.apiUrl + resourcePath,
      this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getObjectByUrl(url: string = '') {
    this.httpOptions = { headers: this.httpHeaders };
    console.log(url);
    return this.http.get<any>(url,
      this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  public addObject(postData: any, resourcePath: string = '') {
    return this.http.post<any>(
      environment.apiUrl + resourcePath,
      postData, this.postHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  public downloadObject(resourcePath: string = '') {
    const url = environment.apiUrl + resourcePath;
    // console.log(url);
    return this.http.get<any>(environment.apiUrl + resourcePath,
      this.downloadHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  downloadFile(response: any) {
    let header_content = response.headers.get('content-disposition');
    let file = header_content.split('=')[1];
    file = file.substring(1, file.length - 1);
    let extension = file.split('.')[1].toLowerCase();
    // It is necessary to create a new blob object with mime-type explicitly set
    let newVariable: any = window.navigator;
    // otherwise only Chrome works like it should
    var newBlob = new Blob([response.body], { type: this.createFileType(extension) })

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (newVariable && newVariable.msSaveOrOpenBlob) {
        newVariable.msSaveOrOpenBlob(newBlob);
        return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = file;
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 400)
  }
   createFileType(e: string): string {
      let fileType: string = "";
      if (e == 'pdf' || e == 'csv') {
        fileType = `application/${e}`;
      }
      else if (e == 'jpeg' || e == 'jpg' || e == 'png') {
        fileType = `image/${e}`;
      }
      else if (e == 'txt') {
        fileType = 'text/plain';
      }
  
      else if (e == 'ppt' || e == 'pot' || e == 'pps' || e == 'ppa') {
        fileType = 'application/vnd.ms-powerpoint';
      }
      else if (e == 'pptx') {
        fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      }
      else if (e == 'doc' || e == 'dot') {
        fileType = 'application/msword';
      }
      else if (e == 'docx') {
        fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      else if (e == 'xls' || e == 'xlt' || e == 'xla') {
        fileType = 'application/vnd.ms-excel';
      }
      else if (e == 'xlsx') {
        fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
  
      return fileType;
    }
}
