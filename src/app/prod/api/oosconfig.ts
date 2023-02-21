export class OOSConfig {
    Id?: string;
    OOS_Key?: string;
    OOS_Comment?: string;
    OOS_Type?: string;
    OOS_Icon?: string;

    constructor(Id: string, OOS_Key: string, OOS_Comment: string, OOS_Type: string, OOS_Icon: string)
    {
        this.Id = Id;
        this.OOS_Key = OOS_Key;
        this.OOS_Comment = OOS_Comment;
        this.OOS_Type = OOS_Type;
        this.OOS_Icon = OOS_Icon;
    }
}