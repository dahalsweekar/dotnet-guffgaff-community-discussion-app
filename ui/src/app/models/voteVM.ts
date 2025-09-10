export interface VoteModel{
    owner: string,
    voter: string,
    postId: number,
    upVote: boolean,
    commentId?:number
}