import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecinfoDetailComponent } from './specinfo-detail.component';
import { SpecinfoDetailRoutingModule } from './specinfo-detail-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  imports: [
    CommonModule,
    SpecinfoDetailRoutingModule,
    FormsModule,
	TableModule,
	RatingModule,
	ButtonModule,
	SliderModule,
	InputTextModule,
	ToggleButtonModule,
	RippleModule,
	MultiSelectModule,
	DropdownModule,
	ProgressBarModule,
	ToastModule,
	MessagesModule, MessageModule, 
	ConfirmDialogModule, 
	FileUploadModule, BlockUIModule,
	DialogModule, CheckboxModule
  ],
  declarations: [SpecinfoDetailComponent]
})
export class SpecinfoDetailModule { }
