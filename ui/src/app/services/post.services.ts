import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PostServices{
    private postThoughtApi = '/api/postthought';
    private getThoughtApi = '/api/getthought';

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

    postThoughtfn(thought: any): Observable<any>{
        return this.http.post(this.postThoughtApi, thought);
    }
}