export class OOSMaskConfig
{
    Id?: string;
    OOS_Config_Id?: string;
    OOS_Mask?: string;
    CreatedDate?: Date;
    CreatedBy?: string;
    LastUpdatedDate?: Date;
    LastUpdatedBy?: string;
    Status?: string;
    ServerName?: string;

    constructor(Id: string, OOS_Config_Id: string, OOS_Mask: string, CreatedDate: Date, CreatedBy: string, LastUpdatedDate: Date, LastUpdatedBy: string, Status: string, serverName: string)
    {
        this.Id = Id;
        this.OOS_Config_Id = OOS_Config_Id;
        this.OOS_Mask = OOS_Mask;
        this.CreatedDate = CreatedDate;
        this.CreatedBy = CreatedBy;
        this.LastUpdatedDate = LastUpdatedDate;
        this.LastUpdatedBy = LastUpdatedBy;
        this.Status = Status;
        this.ServerName = serverName;
    }
}