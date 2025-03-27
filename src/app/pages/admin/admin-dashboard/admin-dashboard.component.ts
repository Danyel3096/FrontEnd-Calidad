import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [SidebarComponent],
  selector: 'app-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
