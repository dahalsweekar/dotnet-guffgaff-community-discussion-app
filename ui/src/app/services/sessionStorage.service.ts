import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class SessionStorage{

    storeSession(key: string, value: string) {
        sessionStorage.setItem(key, value);
    }

    getSession(key:string): string{
        return sessionStorage.getItem(key) || '';
    }

    deleteSession(key: string) {
        sessionStorage.removeItem(key);
    }

    deleteAllSession(keys: string[]){
        for(let key of keys){
            sessionStorage.removeItem(key);
        }
    }
}