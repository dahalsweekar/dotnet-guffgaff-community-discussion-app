import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PostServices{
    private postThoughtApi = '/api/postthought';
    private getThoughtApi = '/api/getthought';

    constructor(private http: HttpClient, private router: Router){}

    postThoughtfn(thought: any): Observable<any>{
        return this.http.post(this.postThoughtApi, thought);
    }
}