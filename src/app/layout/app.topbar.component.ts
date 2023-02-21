import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MegaMenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    userInfo: string = 'Guest';

    constructor(public layoutService: LayoutService, private router: Router) { }

    ngOnInit()
    {
        var userMail = localStorage.getItem('userMail');
        if (userMail) this.userInfo = userMail;

        this.items = [
            {
                label: this.userInfo,
                icon:'pi pi-fw pi-user',
                items: [
                    // { label: this.userInfo },
                    // {separator: true},
                    {
                    label: 'Sign Out', icon: 'pi pi-fw pi-sign-out', command: () => {
                        this.router.navigateByUrl('/auth/login');
                    }}
                ]
            }
        ];
    }
}
