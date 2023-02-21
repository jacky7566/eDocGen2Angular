import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SpecInfo } from 'src/app/prod/api/specinfo';
import { OOSConfig } from 'src/app/prod/api/oosconfig';
import { OOSMaskConfig } from 'src/app/prod/api/oosmaskconfig';
import { SpecInfoGroup } from 'src/app/prod/api/specinfogroup';
import { SharedService } from 'src/app/prod/service/shared.service';
import { Table } from 'primeng/table';
import { Message, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { SpecinfoService } from 'src/app/prod/service/specinfo.service';
import { environment } from 'src/environments/environment';
import { Guid } from 'guid-typescript';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  templateUrl: './specinfo-detail.component.html',
  providers: [MessageService, ConfirmationService]
})
export class SpecinfoDetailComponent implements OnInit {  
  SpecInfoList: SpecInfo[] = [];
  SpecInfoColList: string[] = [];
  SpecInfoGroups: SpecInfoGroup[] = [];
  statuses: any[] = [];
  rowGroupMetadata: any;
  expandedRows: expandedRows = {};
  activityValues: number[] = [0, 100];
  isExpanded: boolean = false;
  idFrozen: boolean = false;
  loading: boolean = true;
  selectedGroupItem: SpecInfoGroup = new SpecInfoGroup();
  selectedGroup: any;
  msgs: Message[] = [];
  uploadedFiles: any[] = [];
  blockedDocument: boolean = false;
  blockedDocumentOOS: boolean = false;
  selectedSpecInfo: any;
  showCfgDialog: boolean = false;
  selectedCfgs: string[] = [];
  oosConfigs: OOSConfig[] = [];
  umcAPIUrl: string = environment.apiUrl + "/ProcessAndUploadUMCFile";

  @ViewChild('filter') filter!: ElementRef;

  constructor(private sharedService: SharedService, private specInfoService: SpecinfoService,
     private msgService: MessageService, private cfmService: ConfirmationService) { }

  ngOnInit(): void {
    this.specInfoService.getSpecInfoGroups().then(datas => this.SpecInfoGroups = datas);
    this.sharedService.getObject('/GetOOSConfig').subscribe(data => { 
      if (data !== null && data.length > 0) {
        this.oosConfigs = data
      }
    });
    this.loading = false;
  }

  //#region Event Handeler
  //For Spec Info Group Event
  comboboxOnSelected(item: SpecInfoGroup): void {
    this.selectedGroupItem = item; 
    this.sharedService.getObject('/GetSpecInfo?groupName=' + item.data).subscribe(data => { 
      if (data !== null && data.length > 0) {
        this.SpecInfoList = data
        this.SpecInfoColList = Object.keys(this.SpecInfoList[0]).filter(r=> r != 'Spec_Id' && r != 'Id');
      }
    });
    this.loading = false;
  }

  //No use for now
  onRowSelect(event: any): void{
    //this.selectedGroupValue = event.data;
  }

  //For Upload UMC Usage
  uploadUMCFile(event: any, item: SpecInfo)
  {
    //console.log(event.file);
    this.cfmService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //this.msgService.add({severity:'info', summary: 'Id:' + item.Id, detail: 'Get Id'});
        let fileToUpload = <File> event.files[0];
        // var inputObj = {
        //   id: item.Id,
        //   fileName: fileToUpload.name, 
        //   formFile: fileToUpload.arrayBuffer(),
        //   product: item.Mask, productType: 'NA',
        //   xShift: 0, yShift: 0,
        //   eMapVersion: item.EMapVersion,
        //   createdBy: 'Test'
        // }      
             
        let formData: FormData = new FormData();
        formData.append('Id', item.Id);
        formData.append('FileName', fileToUpload.name);
        formData.append('FormFile', fileToUpload);
        formData.append('Product', item.Mask);
        formData.append('ProductType', 'NA');
        formData.append('XShift', '0');
        formData.append('YShift', '-2');
        formData.append('EMapVersion', item.EMapVersion);
        formData.append('CreatedBy', 'Test');
        this.blockedDocument = true;
        let inputUMC = JSON.stringify(formData);
        this.sharedService.addObject(inputUMC, '/ProcessAndUploadUMCFile').subscribe(data => {
          this.blockedDocument = false;
        }, error => {
          this.blockedDocument = false;
          this.msgService.add({severity:'error', summary: error, detail: 'API returns error'});
        });
      },
      reject: (type: ConfirmEventType) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                this.msgService.add({severity:'error', summary: 'Rejected', detail: 'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                this.msgService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }

  onBeforeUploadUMCFile(event: any, item: SpecInfo)
  {
    event.formData.append('Id', item.Id);
    event.formData.append('Product', item.Mask);
    event.formData.append('Product', item.Mask);
    event.formData.append('ProductType', 'NA');
    event.formData.append('XShift', 0);
    event.formData.append('YShift', -2);
    event.formData.append('EMapVersion', item.EMapVersion);
    event.formData.append('CreatedBy', 'Test');
    this.blockedDocument = true;    
  }

  onUploadUMCFile(event: any) {
    this.blockedDocument = false;
    var filename = event.files[0].name;
    var severityStr = 'success';
    var message = 'UMC File: ' + filename;
    var rtnMsg = '';
    if (event.originalEvent.body.isSuccessStatusCode == false)
    {
      severityStr = 'error';
      message = message + ' upload failed!';
      rtnMsg = event.error.error.rtnMsg;
    }
    else
    {
      message = event.originalEvent.body.rtnMsg;
    }
    this.msgService.add({severity: severityStr, summary: message, detail: rtnMsg});
    this.comboboxOnSelected(this.selectedGroupItem);
  }
  
  //Download UMC File
  downloadUMCFile(id: string, filename: string)
  {
    this.sharedService.downloadObject('/DownloadUMCFile?eDocSpecId=' + id).subscribe(res => 
    { 
      if (res !== null && res.length > 0 ) {
        //this.sharedService.downloadFile(res);
        let dataType = res.type;
        let binaryData = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        if (filename) 
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    }, error => {
      this.msgService.add({severity:'error', summary: 'Download UMC File Error', detail: error.data})
     }, () => {}
    );   
  }

  updateEMapVersion(item: SpecInfo)
  {    
    this.cfmService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const input = JSON.stringify(item);
        this.sharedService.addObject(input, '/SeteDocSpecInfo').subscribe(data => {
          this.msgService.add({severity:'success', summary: data, detail: 'Mask: ' + item.Mask});
        }, error => {
          this.msgService.add({severity:'error', summary: error, detail: 'Mask: ' + item.Mask});
        });
      },
      reject: (type: ConfirmEventType) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                this.msgService.add({severity:'error', summary: 'Rejected', detail: 'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                this.msgService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }

  setOOSMaskConfigs(item: SpecInfo)
  {
    this.selectedSpecInfo = item;
    this.showCfgDialog = true;
    this.selectedCfgs = [];    
    item.OOSMaskConfigs.forEach(r=> {
      if (r.Status == "1") this.selectedCfgs.push(r.OOS_Key);
    });
  }

  updateOOSMaskConfigs(item: SpecInfo)
  {
    this.showCfgDialog = false;
    this.blockedDocumentOOS = true;
    var inputList: OOSMaskConfig[] = [];
    this.oosConfigs.forEach(r=>{
      var dbItem = item.OOSMaskConfigs != null ? item.OOSMaskConfigs.find(d=> d.OOS_Key == r.OOS_Key) : null;
      var selectedValue = this.selectedCfgs.find(s=> s == r.OOS_Key);
      var loginAcc = localStorage.getItem("account");
      if (loginAcc != null)
      {        
        if (dbItem != null && selectedValue == null) //Remove items
        {
          inputList.push(new OOSMaskConfig(dbItem.Id, dbItem.OOS_Config_Id, item.Mask, dbItem.CreatedDate, dbItem.CreatedBy, new Date(), loginAcc, "0", ""));
        }
        if (dbItem != null && selectedValue != null) //Update items
        {
          inputList.push(new OOSMaskConfig(dbItem.Id, dbItem.OOS_Config_Id, item.Mask, dbItem.CreatedDate, dbItem.CreatedBy, new Date(), loginAcc, "1", ""));
        }
        if (dbItem == null && selectedValue != null) //Added new item
        {
          inputList.push(new OOSMaskConfig(Guid.create().toString(), r.Id!, item.Mask, new Date(), loginAcc, new Date(), loginAcc, "1", ""));  
        }
      }
    });

    let inputData = JSON.stringify(inputList);    
    this.sharedService.addObject(inputData, '/SetOOSConfigByMask').subscribe(data => {
      this.comboboxOnSelected(this.selectedGroup);
      this.blockedDocumentOOS = false;
      this.msgService.add({severity: 'success', summary: 'Mask: ' + item.Mask + ' OOS setup successed', detail: ''});      
    }, error => {
      this.blockedDocumentOOS = false;
      this.msgService.add({severity:'error', summary: error, detail: 'API returns error'});
    });
  }
  //#endregion

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table, groupDP: Dropdown) {
      this.SpecInfoList = [];
      table.clear();
      groupDP.selectItem(null, null);
      this.filter.nativeElement.value = '';
  }

}
