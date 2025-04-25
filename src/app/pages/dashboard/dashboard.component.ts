import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  themeService = inject(DynamicThemeService);

  textTitleColor = '';
  textBodyColor = '';
  backgroundSecondary = '';
  fontFamily = '';
  fontSize = '';

  constructor() { }

  ngOnInit(): void {
    this.themeService.getSection('pageContent').subscribe(colors => {
      this.textTitleColor = colors.textTitle;
      this.textBodyColor = colors.textBody;
      this.backgroundSecondary = colors.backgroundSecondary;
      this.fontFamily = colors.fontFamily;
      this.fontSize = colors.fontSize;
    });
  }

}
