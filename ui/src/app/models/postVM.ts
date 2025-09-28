export interface PostModel{
    PostId?: string,
    Owner: string,
    OwnerName?: string,
    Title: string,
    Description: string,
    UpVotes: number,
    DownVotes: number,
    Comments?: number,
    Category?: string,
    PostedDate?: string,
    IsRemoved?: boolean,
    IsEdited?: boolean
}