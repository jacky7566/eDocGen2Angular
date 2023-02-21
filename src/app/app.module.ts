import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './prod/components/notfound/notfound.component';
import { ProductService } from './prod/service/product.service';
import { CountryService } from './prod/service/country.service';
import { CustomerService } from './prod/service/customer.service';
import { EventService } from './prod/service/event.service';
import { IconService } from './prod/service/icon.service';
import { NodeService } from './prod/service/node.service';
import { PhotoService } from './prod/service/photo.service';
import { SpecinfoService } from './prod/service/specinfo.service';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, SpecinfoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
