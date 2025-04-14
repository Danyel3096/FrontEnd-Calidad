import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  selector: 'app-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  themeService = inject(DynamicThemeService);

  textTitleColor = '';
  textBodyColor = '';
  backgroundSecondary = '';

  constructor() { }

  ngOnInit(): void {
    this.themeService.getSection('pageContent').subscribe(colors => {
      this.textTitleColor = colors.textTitle;
      this.textBodyColor = colors.textBody;
      this.backgroundSecondary = colors.backgroundSecondary;
    });
  }

}
