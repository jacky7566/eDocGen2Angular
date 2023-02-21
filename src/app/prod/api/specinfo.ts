export interface SpecInfo {
    Id: string;
    Spec_Id: string;
    Mask: string;
    Spec_FileName: string;
    Spec_Version: string;
    EMapVersion: string;
    UMCFileName: string;
    OOSMaskConfigs: OOSViewConfig[];
}

export interface OOSViewConfig
{
    Id: string;
    OOS_Config_Id: string;
    CreatedDate: Date;
    CreatedBy: string;
    LastUpdatedDate: Date;
    LastUpdatedBy: string;
    OOS_Key: string;
    OOS_Comment: string;
    OOS_Type: string;
    OOS_Mask: string;
    OOS_Icon: string;
    Status: string;
}