import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecinfoDetailComponent } from './specinfo-detail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SpecinfoDetailComponent }
	])],
  exports: [RouterModule]
})
export class SpecinfoDetailRoutingModule { }
