import { userData } from 'src/app/shared/models/user.model';
import { DataRequestService } from 'src/app/services/data-request/data-request.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as c3 from 'c3';
import { LoadingReqService } from 'src/app/services/loading-req/loading-req.service';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  allUsers!: userData[];
  totalAge!: [];

  dataAge: number[] = [];
  dataTotal: number[] = [];

  isLoading = false;

  constructor(
    private _router: Router,
    private _dataRequest: DataRequestService,
    private _loadingService: LoadingReqService
  ) {}

  ngOnInit(): void {
    this._loadingService.isLoading.subscribe((data) => {
      this.isLoading = data;
    });

    this._dataRequest.getAllUser().subscribe((res) => {
      this.allUsers = res;
      console.log(res);

      let result: any = [];

      //* Group age: - total:

      res.reduce((group: any, user: any) => {
        if (!group[user.age]) {
          group[user.age] = { age: user.age, total: 0 };
          result.push(group[user.age]);
        }
        group[user.age].total += 1;
        return group;
      }, {});

      result = result.sort((a: any, b: any) => b.age - a.age);

      result.forEach((element: any) => {
        this.dataAge.push(element.age);
        this.dataTotal.push(element.total);
      });

      const chart = c3.generate({
        bindto: '#chart',
        padding: {
          left: 100,
        },
        data: {
          x: 'x',
          columns: [
            ['x', ...this.dataAge],
            ['Total', ...this.dataTotal],
          ],
          onclick: (data: any) => {
            const { index } = data;
            const { age } = result[index];
            this._router.navigate(['users'], {
              queryParams: { age: age },
            });
          },
          type: 'bar',
          labels: true,
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            label: { text: 'Age', position: 'outer-right' },
          },
          y: {
            label: { text: 'Total', position: 'outer-bottom' },
          },
        },
        grid: {
          x: {
            show: true,
          },
          y: {
            show: true,
          },
        },
        size: {
          height: 500,
        },
      });
    });
  }

  ngAfterViewInit() {
    // const chart = c3.generate({
    //   bindto: '#chart',
    //   padding: {
    //     left: 100,
    //   },
    //   data: {
    //     x: 'x',
    //     columns: [
    //       ['x', ...this.dataAge],
    //       ['Total', ...this.dataTotal],
    //     ],
    //     onclick: (data: any) => {
    //       const { index } = data;
    //       const { age } = this.totalAge[index];
    //       this._router.navigate(['users'], {
    //         queryParams: { age: age },
    //       });
    //     },
    //     type: 'bar',
    //     labels: true,
    //   },
    //   axis: {
    //     rotated: true,
    //     x: {
    //       type: 'category',
    //       label: { text: 'Age', position: 'outer-right' },
    //     },
    //     y: {
    //       label: { text: 'Total', position: 'outer-bottom' },
    //     },
    //   },
    //   // grid: {
    //   //   y: {
    //   //     show: true,
    //   //   },
    //   // },
    // });
  }
}
