import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable, ObservedValueOf } from "rxjs";
import { Router } from "@angular/router";

export class PageServices{

        constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){}

        reloadComponent(url: string) {
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
         this.router.navigate([url]);
       });
     }

}