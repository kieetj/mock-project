import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/table/table.module').then((m) => {
        return m.TableModules;
      }),
  },
  {
    path: 'chart',
    loadChildren: () =>
      import('./modules/chart/chart.module').then((m) => {
        return m.ChartModule;
      }),
  },
  {
    path: '**',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
