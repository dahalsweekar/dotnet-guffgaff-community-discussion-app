import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class LocalStorage{

    storeSession(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    getSession(key:string): string{
        return localStorage.getItem(key) || '';
    }

    deleteSession(key: string) {
        localStorage.removeItem(key);
    }

    deleteAllSession(keys: string[]){
        for(let key of keys){
            localStorage.removeItem(key);
        }
    }
}