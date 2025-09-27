export interface CommentModel {
    PostId: string,
    UserId: string,
    UpVotes?: number,
    DownVotes?: number
    CommentId: number;
    ParentId: number | null;
    CommentDescription: string;
    Replies?: CommentModel[];
    CommentDate?: string;
    IsRemoved?: boolean,
    IsEdited?: boolean
    localIsEditing?: boolean
}