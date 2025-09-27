import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CommentServices{
    private saveCommentApi: string = '/api/savecomment';
    private getCommentsApi: string = '/api/getcomments';
    private updateVoteCommentApi: string = '/api/updatevotecomment';
    private saveReplyApi: string = '/api/savereply';
    private updateCommentApi: string = '/api/updatecomment';
    private deleteCommentApi: string = '/api/deletecomment';
    private updateReplyApi: string = '/api/updatereply';
    private deleteReplyApi: string = '/api/deletereply';

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

    saveCommentfn(comment: any): Observable<any>{
        return this.http.post(this.saveCommentApi, comment);
    }

    getCommentsfn(postId: any): Observable<any> {
        return this.http.post(this.getCommentsApi, postId);
    }

    updateVoteCommentfn(vote: any): Observable<any>{
        return this.http.post(this.updateVoteCommentApi, vote);
    }

    saveReplyfn(reply: any): Observable<any>{
        return this.http.post(this.saveReplyApi, reply);
    }

    updateCommentfn(comment: any): Observable<any>{
        return this.http.post(this.updateCommentApi, comment);
    }

    deleteCommentfn(comment: any): Observable<any>{
        return this.http.post(this.deleteCommentApi, comment);
    }
}