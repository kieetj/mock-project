import { userData } from 'src/app/shared/models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(protected _http: HttpClient) {}
  BASE_URL = 'https://623aba41b5292b8bfcb8db9d.mockapi.io';
  get<T>(endUrl: string) {
    return this._http.get<T>(`${this.BASE_URL}/${endUrl}`);
  }

  getParamsSearch<T>(endUrl: string, search: string) {
    let params = new HttpParams();
    params = params.append('search', search);

    return this._http.get<T>(`${this.BASE_URL}/${endUrl}`, { params: params });
  }

  getMultiParams<T>(endUrl: string, paramsObj: { page: any; limit: any }) {
    let params = new HttpParams();

    params = params.append('page', paramsObj.page);
    params = params.append('limit', paramsObj.limit);

    return this._http.get<T>(`${this.BASE_URL}/${endUrl}`, { params: params });
  }

  getDataParam<T>(endUrl: string, age: any) {
    let params = new HttpParams();
    params = params.append(`${age}`, age);
    return this._http.get<T>(`${this.BASE_URL}/${endUrl}`, { params: params });
  }

  getCompanyGroupAPI<T>(endUrl: string) {
    return this._http.get<T>(
      `https://623acd76f8827fbe47a8bc94.mockapi.io/${endUrl}`
    );
  }
  post<T>(endUrl: string, bodyData: userData) {
    return this._http.post<T>(`${this.BASE_URL}/${endUrl}`, bodyData);
  }
  put<T>(endUrl: string, bodyData: {}) {
    return this._http.put<T>(`${this.BASE_URL}/${endUrl}`, bodyData);
  }
  delete(endUrl: string) {
    return this._http.delete(`${this.BASE_URL}/${endUrl}`);
  }
}
