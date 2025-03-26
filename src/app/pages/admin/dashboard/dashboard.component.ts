import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [SidebarComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
