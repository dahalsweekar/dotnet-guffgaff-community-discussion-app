import { HttpClient, httpResource } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PostServices{
    private putPostApi: string = '/api/putpost';
    private getPostApi: string = '/api/getpost';
    private updateVoteApi: string = '/api/updatevote';
    private searchPostApi: string = '/api/searchpost';
    private updatePostApi: string = '/api/updatepost';
    private deletePostApi: string = '/api/deletepost';

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

    putPostfn(post: any): Observable<any>{
        return this.http.post(this.putPostApi, post);
    }

    getPostfn(post: any): Observable<any>{
        return this.http.post(this.getPostApi, post)
    }

    updateVotefn(userId: any):Observable<any>{
        return this.http.post(this.updateVoteApi, userId)
    }

    searchPostfn(searchKey: any):Observable<any>{
        return this.http.post(this.searchPostApi, searchKey);
    }

    updatePostfn(post: any): Observable<any>{
        return this.http.post(this.updatePostApi, post);
    }
    
    deletePostfn(post: any): Observable<any>{
        return this.http.post(this.deletePostApi, post);
    }
}