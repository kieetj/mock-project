import { forkJoin } from 'rxjs';
import { DataRequestService } from 'src/app/services/data-request/data-request.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userData } from 'src/app/shared/models/user.model';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { zipCodeModel } from 'src/app/shared/models/zipcode.model';
import { CompanyGroupModel } from 'src/app/shared/models/company-group.model';
import { CompanyByIdModel } from 'src/app/shared/models/company.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  formEdit!: FormGroup;

  user!: userData;

  zipCodes!: zipCodeModel[];

  companyGroupAPI!: CompanyGroupModel[];

  company!: CompanyByIdModel[];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dataRequest: DataRequestService,
    private confirmationService: ConfirmationService,

    private messageService: MessageService,
    private _router: Router,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formEdit = this._fb.group({
      id: [''],
      name: ['', Validators.required],
      age: ['', Validators.required],
      mail: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      zipcode: ['', Validators.required],
      companyGroup: ['', Validators.required],
      company: ['', Validators.required],
    });

    this._activatedRoute.params.subscribe((param) => {
      const id = param['id'];

      forkJoin([
        this._dataRequest.getZipcode1(),
        this._dataRequest.getZipcode2(),
        this._dataRequest.getUserByID(id),
        this._dataRequest.getCompanyGroup(),
      ]).subscribe((res) => {
        const data: any = res[2];
        console.log(res);

        this.user = data;
        this.zipCodes = [...res[0], ...res[1]];
        this.companyGroupAPI = res[3];
        const {
          id,
          name,
          age,
          mail,
          address,
          phone,
          zipcode,
          companyGroup,
          company,
        } = data;

        //? Binding value to form
        this.formEdit.patchValue({
          id,
          name,
          age,
          mail,
          address,
          phone,
          zipcode,
          companyGroup: companyGroup,
          company,
        });
        console.log(data.companyGroup);

        this.changes(data.companyGroup);
      });
    });
  }

  //? onChange when companygroupChange --> company will be show
  changes(codeCompanyGroup: string) {
    const getCompanyGroup = this.companyGroupAPI.filter(
      (data) => data.code === codeCompanyGroup
    );
    console.log(getCompanyGroup);
    this._dataRequest
      .getCompanyById(getCompanyGroup[0]?.id)
      .subscribe((data: any) => {
        this.company = data.company;
      });
  }

  confirmExit(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Register',
      message: 'If you cancel, information you filled will be lost?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success!',
        //   detail: 'Register user successfully ',
        //   life: 2000,
        // });
        //todo Navagate here !
        this._router.navigate(['users']);
      },
    });
  }

  confirmEdit(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Edit information',
      message: 'Do you want to update information?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success!',
        //   detail: 'Register user successfully ',
        //   life: 2000,
        // });
        //todo Navagate here !
        this.onSubmit();
      },
    });
  }

  onSubmit() {
    const updateUser = this.formEdit.value;
    const id = updateUser.id;
    this._dataRequest.updateUser(updateUser, id).subscribe((res) => {
      console.log(res);
      this.showSuccess();
    });
    setTimeout(() => {
      this._router.navigate(['users']);
    }, 500);
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Information updated successfully',
      life: 2000,
    });
  }
}
