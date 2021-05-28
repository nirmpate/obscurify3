import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  userProfile: any;
  userLogedIn = false;

  constructor() { }

  ngOnInit(): void {
    this.userProfile = JSON.parse(window.localStorage.getItem('userProfile'));


    if (this.userProfile) {
      this.userLogedIn = true;
    }
  }


}
