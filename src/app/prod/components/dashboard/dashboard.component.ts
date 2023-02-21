import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { TraceabilityStatusClass } from '../../api/edocresult';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Dropdown } from 'primeng/dropdown';
import { Table } from 'primeng/table';
import { SpecInfoGroup } from 'src/app/prod/api/specinfogroup';
import { SpecinfoService } from 'src/app/prod/service/specinfo.service';
import { SharedService } from '../../service/shared.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { Message, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    //Code Start
    EDocTitle: string = '';
    SpecInfoGroups: SpecInfoGroup[] = [];
    MaskList: SpecInfoGroup[] = [];
    EDocResultList: TraceabilityStatusClass[]= [];
    EDocColList: string[] = [];
    EDocStatusList: SpecInfoGroup[] = [];
    selectedGroup: any;
    selectedMask: any;
    selectedStatus: any;
    eDocLoading: boolean = true;
    selectedEDocs: TraceabilityStatusClass[] = [];
    eDocDialogShow: boolean = false;
    eDocREText: string = '';
    selectedSuccessReGenTypes: string[] = [];
    selectedFailReGenTypes: string[] = [];
    
    @ViewChild('eDocFiler') filter!: ElementRef;

    constructor(public layoutService: LayoutService, private specInfoService: SpecinfoService,
        private sharedService: SharedService, private clipboardApi: ClipboardService,
        private msgService: MessageService, private cfmService: ConfirmationService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.specInfoService.getSpecInfoGroups().then(datas => this.SpecInfoGroups = datas);
        this.eDocLoading = false;
        this.EDocStatusList.push(new SpecInfoGroup('Fail', 'Fail'));
        this.EDocStatusList.push(new SpecInfoGroup('Success', 'Success'));
        this.selectedSuccessReGenTypes.push('Force Regenerate');
        this.selectedFailReGenTypes.push('By-pass 2DBC');
        this.selectedFailReGenTypes.push('By-pass 5-Dies');
        //let a = new TraceabilityStatusClass();
        // const instance = new TraceabilityStatusClass();
        // this.EDocColList = Object.getOwnPropertyNames(instance).filter(r=> r != 'Ingestion_LastUpdatedDate');
    }

    eDocGroupOnSelected(selectedGroup: SpecInfoGroup)
    {
        this.MaskList = [];
        var groupName = selectedGroup.data;
        this.eDocLoading = true;
        this.sharedService.getObject('/GetWaferIdByMaskGroup?maskGroup=' + groupName).subscribe(data => { 
            if (data !== null && data.length > 0) {
                var result: string[] = data;
                result.forEach(item => {
                    this.MaskList.push(new SpecInfoGroup(item, item));
                    this.eDocLoading = false;
                });
            }
        });   
    }

    eDocMaskOnSelected(selectedMask: SpecInfoGroup)
    {
        //const sucObj = this.getEDocListByStatus('Success');
        const rtnObj = this.getEDocListByStatus(this.selectedStatus.data);
        Promise.all([rtnObj]).then(result=>{
            this.EDocResultList = result[0];
            this.EDocColList = Object.keys(this.EDocResultList[0]).filter(r=> r != 'Ingestion_LastUpdatedDate');
        }).catch((ex)=>{

        }).finally(()=>this.eDocLoading = false)
    }

    getEDocListByStatus(status: string)
    {
        this.eDocLoading = true;
        const result:TraceabilityStatusClass[] = [];
        const url = new URL(environment.apiUrl + "/QueryRWStatus");
        url.searchParams.append("rowNum", "500");
        url.searchParams.append("maskGroup", this.selectedGroup.data);
        url.searchParams.append("maskId", this.selectedMask.data);
        url.searchParams.append("eDocStatus", status);
        
        const res = lastValueFrom(this.sharedService.getObjectByUrl(url.href));
    
        return res;
    }

    showEDocDialog()
    {
        if (this.selectedEDocs.length == 0)
        {
            this.msgService.add({severity:'warn', summary: 'Please select at least one item', detail: ''})
        }
        else
        {
            this.eDocDialogShow = true;
            this.eDocREText = this.selectedEDocs.length.toString();
            if (this.eDocREText.length > 0) this.eDocREText.trimEnd();
        }             
    }

    clear(table: Table, groupDP: Dropdown, maskDP: Dropdown) {
        //this.SpecInfoList = [];
        table.clear();
        this.EDocResultList = [];
        groupDP.selectItem(null, null);
        maskDP.selectItem(null, null);
        this.filter.nativeElement.value = '';
        this.eDocLoading = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clickToCopy(url: string)
    {
        this.clipboardApi.copyFromContent(url);
    }
    

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
