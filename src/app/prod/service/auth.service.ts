import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SidebarMenu } from '../api/SidebarMenu';
import { UserInfo } from '../api/userinfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'text/plain'
  });
  
  constructor(private http: HttpClient) { }

  userAuthentication(userName: string, password: string) {
    const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(environment.authAPIUrl + 'token', data, { headers: reqHeader });
  }

  async getRoles(userId: string) {
    const res = await this.http.get<any>(environment.authAPIUrl + 'api/Roles/' + userId).toPromise();
    const data = (<SidebarMenu[]>res);
    return data;
  }

  async getUserInfo(userId: string) {
    const res = await this.http.get<any>(environment.authAPIUrl + 'api/Account/UserInfo/' + userId).toPromise();
    const data = (<UserInfo>res);
    return data;
  }
}
