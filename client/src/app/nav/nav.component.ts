import {  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService, private router:Router) {}

  ngOnInit():void {}

  login() {
    this.accountService.login(this.model).subscribe(
      (res) => {
        this.router.navigateByUrl('/members');
      },
      (error) => {
        console.log(error);
        alert(error);
      }
    );
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }


}
