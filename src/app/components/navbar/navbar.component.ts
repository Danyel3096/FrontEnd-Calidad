import { LoginService } from './../../services/login.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { CartStateService } from '../../pages/products/shared/data-access/cart-state.service';


@Component({
  standalone:true,
  imports:[CommonModule,MaterialModule,RouterModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  isLoggedIn = false;
  user:any = null;

  constructor(public login:LoginService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
  }

  public logout(){
    this.login.logout();
    window.location.reload();
  }

  cartState = inject(CartStateService).state;

}

