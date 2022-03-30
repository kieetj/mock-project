import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';

import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [TableComponent, UserCreateComponent, UserDetailComponent],
  imports: [
    CommonModule,
    TableModule,
    TableRoutingModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    ContextMenuModule,
    DialogModule,
    DropdownModule,
    ProgressBarModule,
    TagModule,
    FormsModule,
    RouterModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    ReactiveFormsModule,
    SkeletonModule,
    PaginatorModule,
  ],
})
export class TableModules {}
