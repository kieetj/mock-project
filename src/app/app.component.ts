import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mock-project';
  collapseSideBar = false;

  closeSideBar() {
    this.collapseSideBar = true;
  }

  openSideBar() {
    this.collapseSideBar = false;
  }
}
