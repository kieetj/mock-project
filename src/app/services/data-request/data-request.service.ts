import { CompanyByIdModel } from 'src/app/shared/models/company.model';
import { CompanyGroupModel } from 'src/app/shared/models/company-group.model';
import { zipCodeModel } from './../../shared/models/zipcode.model';
import { switchMap, timer } from 'rxjs';
import { userData } from './../../shared/models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base-service.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataRequestService extends BaseService {
  constructor(
    protected http: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) {
    super(http);
  }
  //*User
  getAllUser() {
    return this.get<userData[]>('users');
  }

  getAllUserPage(paramsObj: { page: any; limit: any }) {
    return this.getMultiParams<userData[]>('users', paramsObj);
  }

  getAllUserByAge(age: any) {
    return this.getDataParamAge<userData[]>(`users`, age);
  }

  getUserByID(id: number) {
    return this.get<userData[]>(`users/${id}`);
  }

  updateUser(user: userData, id: number) {
    return this.put<userData>(`users/${id}`, user);
  }

  deleteUserById(id: number) {
    return this.delete(`users/${id}`);
  }

  userRegister(user: userData) {
    return this.post<userData>(`users`, user);
  }

  //*Zipcode

  getZipcode1() {
    return this.get<zipCodeModel[]>(`zipcode-1`);
  }
  getZipcode2() {
    return this.get<zipCodeModel[]>(`zipcode-2`);
  }

  getCompanyGroup() {
    return this.getCompanyGroupAPI<CompanyGroupModel[]>(`companyGroup`);
  }

  getCompanyById(id: number = 1) {
    return this.get<CompanyByIdModel[]>(`company/${id}`);
  }
  //*Company

  getCompany() {
    return this.get<CompanyByIdModel[]>('company');
  }

  //*Search

  globalSearch(searchKeyword: string) {
    return this.getParamsSearch<userData[]>(`users`, searchKeyword);
  }
}
