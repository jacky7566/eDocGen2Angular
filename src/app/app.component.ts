import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from './../environments/environment';
import { AuthService } from './prod/service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private authService: AuthService, private router: Router) {
        console.log(environment.apiUrl); // Logs false for default environment
     }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
