import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './prod/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([            
            {
                path: '', component: AppLayoutComponent,
                children: [                    
                    { path: '', loadChildren: () => import('./prod/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
                    { path: 'uikit', loadChildren: () => import('./prod/components/uikit/uikit.module').then(m => m.UIkitModule), canActivate: [AuthGuard] },
                    { path: 'utilities', loadChildren: () => import('./prod/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./prod/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./prod/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./prod/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./prod/components/auth/auth.module').then(m => m.AuthModule) },            
            { path: 'landing', loadChildren: () => import('./prod/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
