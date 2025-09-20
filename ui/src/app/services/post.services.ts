import { HttpClient, httpResource } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PostServices{
    private putPostApi = '/api/putpost';
    private getPostApi = '/api/getpost';
    private updateVoteApi = '/api/updatevote';
    private searchPostApi = '/api/searchpost';

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

    putPostfn(post: any): Observable<any>{
        debugger;
        return this.http.post(this.putPostApi, post);
    }

    getPostfn(post: number): Observable<any>{
        return this.http.post(this.getPostApi, post)
    }

    updateVotefn(userId: any):Observable<any>{
        return this.http.post(this.updateVoteApi, userId)
    }

    searchPostfn(searchKey: any):Observable<any>{
        return this.http.post(this.searchPostApi, searchKey);
    }

}