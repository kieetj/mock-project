import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingReqService } from '../services/loading-req/loading-req.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _loadingService: LoadingReqService
  ) {}

  intercept(
    request: HttpRequest<unknown>,

    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('loading...');
    this._loadingService.showLoading();

    return next.handle(request).pipe(
      finalize(() => {
        console.log('Done....');
        this._loadingService.hideLoading();
      })
    );
  }
}
