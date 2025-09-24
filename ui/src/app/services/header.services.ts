import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerRefreshSubject = new Subject<void>();

  headerRefresh$ = this.headerRefreshSubject.asObservable();

  triggerHeaderRefresh() {
    this.headerRefreshSubject.next();
  }
}
