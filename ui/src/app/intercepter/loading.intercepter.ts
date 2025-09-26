import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { LoadingService } from '../common/loading-bar/loading-bar.service';

export const loadingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
}
