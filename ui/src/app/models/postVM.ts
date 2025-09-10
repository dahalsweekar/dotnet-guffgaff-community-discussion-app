export interface PostModel{
    postId: number,
    owner: string,
    title: string,
    description: string,
    upvotes?: number,
    downvotes?: number,
    comments?: number,
    category?: string
}