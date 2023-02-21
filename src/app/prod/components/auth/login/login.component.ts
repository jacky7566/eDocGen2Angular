import { Component, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/prod/service/auth.service';
import { Router } from '@angular/router';
import { Message, MessageService, ConfirmationService } from 'primeng/api';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService, ConfirmationService]
})


export class LoginComponent {

    valCheck: string[] = ['remember'];    
    password!: string;
    account!: string;
    ckbChecked: boolean = false;
    welcomeName: string = 'Guest';

    constructor(public layoutService: LayoutService, private authService: AuthService, private msgService: MessageService, private router: Router) {

    }

    ngOnInit() {
        //Remove IsPermitted
        sessionStorage.removeItem('IsPermitted');
        //Check IsRememberMe
        var isRememberMe = localStorage.getItem("IsRememberMe");
        if (isRememberMe)
        {
            if (isRememberMe === 'Y')
            {
                this.ckbChecked = true;
                //Set Welcome Info
                var mailMail = localStorage.getItem("userMail");
                if (mailMail) this.welcomeName = mailMail.split('.')[0];
                //Set Account Info
                var getAcc = localStorage.getItem("account");
                if (getAcc) this.account = getAcc;
            }                
            else this.ckbChecked = false;

        }        
    }

    ClickRememberCkb(event: any)
    {
        localStorage.removeItem('IsRememberMe');
        if (event.checked == true)
            localStorage.setItem('IsRememberMe', 'Y');
        else
            localStorage.setItem('IsRememberMe', 'N');
    }

    ClickLogin()
    {           
        this.authService.userAuthentication(this.account, this.password).subscribe((data:any) =>{
                localStorage.setItem('account', this.account);
                localStorage.setItem('UserId', data.userId);
                this.CheckUserRolesAndPermission(data.userId); //Check User Roles and Permissin
                this.GetUserInfomation(data.userId); //Get User Account Informations
            },

            (err) => {
                this.msgService.add({severity:'error', summary: err.error.error, detail: err.error.error_description});
                //localStorage.setItem('IsPermitted', 'N');
                sessionStorage.setItem('IsPermitted', 'N');
            }
        );
        //this.msgService.add({severity:'success', summary: this.account + '/' + this.password, detail: ''});
    }

    CheckUserRolesAndPermission(userId: string)
    {
        this.authService.getRoles(userId).then((roles) => {
            console.log(roles);
            if (roles.length === 0) {
                //this.router.navigateByUrl('/auth/access');
                sessionStorage.setItem('IsPermitted', 'N');
                this.router.navigate(['/auth/access']);
                return;
            }
            localStorage.setItem('userRoles', JSON.stringify(roles));
            var waferResumeRole = roles.find(r=> r.Area == 'wafer-resume');
            if (waferResumeRole != null)
            {
                sessionStorage.setItem('IsPermitted', 'Y');
                this.router.navigate(['']);
            }
            else
            {
                sessionStorage.setItem('IsPermitted', 'N');
                this.router.navigate(['/auth/access']);
            }
        });
    }

    GetUserInfomation(userId: string)
    {
        this.authService.getUserInfo(userId).then((userInfo) => {
            console.log(userInfo);
            if (userInfo == null) {
                this.msgService.add({severity:'error', summary: 'Missing UserInfo', detail: 'Please contact to the IT Administrators'});
                return;
            }
            else
            {
                localStorage.setItem('userMail', userInfo.Email);
            }
            
        },            
        (err) => {
            this.msgService.add({severity:'error', summary: err.error.error, detail: err.error.error_description});
        });
    }
}
