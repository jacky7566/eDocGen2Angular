import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SpecInfo } from '../api/specinfo';
import { SpecInfoGroup } from '../api/specinfogroup';
import { catchError } from 'rxjs/operators';


@Injectable()
export class SpecinfoService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'text/plain'
  });
  private httpOptions = { headers: this.httpHeaders };

  constructor(private http: HttpClient) {}

  getSpecInfo(groupName: string) {
    let res = this.http.get<any>(environment.apiUrl + '/GetSpecInfo?groupName=' + groupName)
        .toPromise()
        .then(res => res.data as SpecInfo[])
        .then(data => data);
    return res;
  }

  getSpecInfoGroups()
  {
    return this.http.get<any>('assets/prod/data/specinfo-group.json')
    .toPromise()
    .then(res => res.data as SpecInfoGroup[])
    .then(data => data);
  }

}

