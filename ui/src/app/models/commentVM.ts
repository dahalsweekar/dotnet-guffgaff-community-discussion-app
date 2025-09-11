export interface CommentModel {
    postId: number,
    userId: string,
    upvotes?: number,
    downvotes?: number
    commentId: number;
    parentId: number | null;
    commentDescription: string;
    replies?: CommentModel[];
}