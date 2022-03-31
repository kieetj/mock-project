import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { userData } from './../../shared/models/user.model';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import {
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  fromEvent,
  tap,
} from 'rxjs';
import { DataRequestService } from 'src/app/services/data-request/data-request.service';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { LoadingReqService } from 'src/app/services/loading-req/loading-req.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  users!: userData[];
  user!: userData;
  selectedUsers!: userData[];

  submitted!: boolean;
  productDialog!: boolean;

  searchQuery!: string;

  isLoading = false;

  valueGlobalSearch = '';

  @ViewChild('dt1') dt1!: Table;
  @ViewChild('input', { static: true }) input!: ElementRef;
  @ViewChild('globalSearch', { static: true }) globalSearch: any;
  @ViewChild('nameSearch', { static: true }) nameSearch: any;

  constructor(
    private _dataRequest: DataRequestService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _loadingService: LoadingReqService
  ) {}

  ngOnInit(): void {
    this._loadingService.isLoading.subscribe((data) => {
      this.isLoading = data;
    });
    this._activatedRoute.queryParams.subscribe((res) => {
      if (res['age']) {
        const age = res['age'];

        this._dataRequest.getAllUserByAge(age).subscribe((data: any) => {
          this.users = data;
        });
      } else {
        // this.getUsersPage();
        this.getUsers();
      }
    });

    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    this.eventGlobalSearch();

    // this.fieldSearch(
    //   this.globalSearch.nativeElement,
    //   this.filterGlobalSearch(),
    //   'seach'
    // );
  }

  eventGlobalSearch() {
    return fromEvent(this.globalSearch.nativeElement, 'keyup')
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        const searchValue = this.globalSearch.nativeElement.value;
        this.valueGlobalSearch = searchValue;
        this._router.navigate(['.'], {
          relativeTo: this._activatedRoute,
          queryParams: { search: searchValue },
        });

        setTimeout(() => {
          this.filterGlobalSearch();
        }, 500);
      });
  }

  getUsers() {
    this._dataRequest
      .getAllUser()
      .subscribe((data: any) => (this.users = data));
  }

  // getUsersPage() {
  //   this._router.navigate(['.'], {
  //     relativeTo: this._activatedRoute,
  //     queryParams: { page: 2, limit: 5 },
  //   });
  //   this._activatedRoute.queryParams.subscribe((res: any) => {
  //     this._dataRequest
  //       .getAllUserPage(res)
  //       .subscribe((data: any) => (this.users = data));
  //   });
  // }
  //* filter table
  filterField($event: Event, field: string) {
    return this.dt1.filter(
      ($event.target as HTMLInputElement).value,
      field,
      'contains'
    );
  }

  filterGlobalSearch(): any {
    this._activatedRoute.queryParams.subscribe((res) => {
      if (res['search']) {
        const searchKeyword = res['search'];

        this._dataRequest
          .globalSearch(searchKeyword)
          .pipe(debounceTime(1000))
          .subscribe((data: any) => {
            this.users = data;
          });
      }
      return;
    });
  }

  filterSearch(field: string): any {
    this._activatedRoute.queryParams.subscribe((res) => {
      if (res[field]) {
        const searchKeyword = res[field];

        this._dataRequest
          .globalSearch(searchKeyword)
          .pipe(debounceTime(1000))
          .subscribe((data: any) => {
            this.users = data;
          });
      }
      return;
    });
  }

  // fieldSearch(inputNativeEle: any, funcSearch: () => any, field: any) {
  //   fromEvent(inputNativeEle, 'keyup')
  //     .pipe(debounceTime(1000), distinctUntilChanged())
  //     .subscribe(() => {
  //       const queryParams = inputNativeEle.value;

  //       this._router.navigate(['.'], {
  //         relativeTo: this._activatedRoute,
  //         queryParams: { [field]: queryParams },
  //       });

  //       setTimeout(() => {
  //         funcSearch();
  //       }, 500);
  //     });
  // }

  //* Notification for Modal

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      header: 'Delete user',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'You have deleted this user',
          life: 2000,
        });
        console.log('OK');
        this._dataRequest.deleteUserById(id).subscribe(() => {
          this._dataRequest
            .getAllUser()
            .subscribe((data: any) => (this.users = data));
        });
      },
    });
  }

  confirmMultiSelected(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete selected user?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      header: 'Delete user',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'You have deleted this user',
          life: 2000,
        });
        this.delSelectedUsers();
      },
    });
  }

  delSelectedUsers() {
    const selected = this.selectedUsers.map((user) => user.id);
    console.log(selected);
    let selectedUserArr: any = [];

    selected.forEach((selectedId) => {
      if (selectedId) {
        const id = +selectedId;

        selectedUserArr.push(this._dataRequest.deleteUserById(id));

        this.selectedUsers = [];
      }
    });

    forkJoin(selectedUserArr)
      .pipe(
        tap(() => {
          this._dataRequest
            .getAllUser()
            .pipe(debounceTime(1000))
            .subscribe((data: any) => {
              this.users = data;
              this.selectedUsers = [];
            });
        })
      )
      .subscribe();
  }

  // globalSearch(searchQuery: string) {
  //   return this._dataRequest
  //     .globalSearch(searchQuery)
  //     .subscribe((data: any) => console.log(data));
  // }
}
