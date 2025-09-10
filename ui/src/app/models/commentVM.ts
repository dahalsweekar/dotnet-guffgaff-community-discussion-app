export interface CommentModel {
    commentId: number,
    postId: number,
    commentThreadId: number,
    userId: string,
    commentDescription: string,
    upvotes?: number,
    downvotes?: number
}