export interface VoteModel{
    Owner: string,
    Voter: string,
    PostId: string,
    UpVote: boolean,
    CommentId?:number
}