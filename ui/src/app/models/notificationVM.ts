export interface NotificationModel{
 ActionPostId: string;
 UserId:string; 
 InitiatorId: string; 
 ActionCommentId?: number;
 ActionTaken: string;
 ActionDate: string ;
 IsReadByUser: boolean ;
}