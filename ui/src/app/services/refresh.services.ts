import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private refreshBSource = new Subject<void>();
  refreshB$ = this.refreshBSource.asObservable();

  triggerRefreshB() {
    this.refreshBSource.next();
  }
}