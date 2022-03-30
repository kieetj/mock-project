import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { forkJoin } from 'rxjs';
import { DataRequestService } from 'src/app/services/data-request/data-request.service';
import {
  RegExAge,
  RegExemail,
  RegExName,
  RegExPhone,
} from 'src/app/shared/custom-validators/validator';
import { CompanyGroupModel } from 'src/app/shared/models/company-group.model';
import { zipCodeModel } from 'src/app/shared/models/zipcode.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  zipCodes!: zipCodeModel[];
  selectedZipCode!: zipCodeModel;

  companyGroup!: CompanyGroupModel[];
  selectedCompanyGroup!: CompanyGroupModel;

  registerForm!: FormGroup;
  showInputAddress = false;

  submitted = false;
  @ViewChild('inputAge', { static: true }) inputAge: any;

  constructor(
    private _dataRequest: DataRequestService,
    private _fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.registerForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(RegExName)]],
      age: ['', [Validators.required, Validators.pattern(RegExAge)]],
      mail: ['', [Validators.required, Validators.pattern(RegExemail)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(RegExPhone)]],
      zipcode: ['', Validators.required],
      companyGroup: ['', Validators.required],
    });

    forkJoin([
      this._dataRequest.getZipcode1(),
      this._dataRequest.getZipcode2(),
    ]).subscribe((res) => {
      this.zipCodes = [...res[0], ...res[1]];
    });

    this._dataRequest.getCompanyGroup().subscribe((res) => {
      this.companyGroup = res;
    });
  }

  confirm(event: Event) {
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
        // this._router.navigate(['users']);
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    const userRegister = { ...this.registerForm.value, company: '' };
    this._dataRequest.userRegister(userRegister).subscribe((rs) => {
      this.showSuccess();
      console.log(rs);
    });
    setTimeout(() => {
      this._router.navigate(['users']);
    }, 1000);
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Register successfully',
      life: 2000,
    });
  }

  showAddress(event: KeyboardEvent) {
    setTimeout(() => {
      const age = parseInt((event.target as HTMLInputElement).value);
      if (age > 15) {
        this.showInputAddress = true;
      } else {
        this.showInputAddress = false;
      }
    }, 500);
  }

  getControlName(field: string) {
    return this.registerForm.get(field);
  }
  getControlNameError() {
    return this.registerForm.get('name')?.errors?.['required'];
  }
}
