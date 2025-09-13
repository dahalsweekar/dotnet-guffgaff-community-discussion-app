export interface PostModel{
    PostId: number,
    Owner: string,
    Title: string,
    Description: string,
    Upvotes?: number,
    Downvotes?: number,
    Comments?: number,
    Category?: string
}