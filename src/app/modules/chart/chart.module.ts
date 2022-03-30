import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { ChartRoutingModule } from './chart-routing.module';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, ChartRoutingModule, SkeletonModule],
})
export class ChartModule {}
