import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class FeedServices{
    private getSavedPostsApi: string = '/api/getsavedpost';
    private getTrendingPostsApi: string = '/api/gettrendingposts';
    private getCategories: string = '/api/getcategories';

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){    }

    getSavedPostsfn(): Observable<any>{
        return this.http.post(this.getSavedPostsApi, {});
    }

    getTrendingPostsfn(): Observable<any>{
        return this.http.post(this.getTrendingPostsApi, {});
    }

    getCategoriesfn(): Observable<any>{
        return this.http.post(this.getCategories, {});
    }

}