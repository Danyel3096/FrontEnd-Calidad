import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-page-tabs',
  imports: [CommonModule],
  templateUrl: './dynamic-page-tabs.component.html',
  styleUrl: './dynamic-page-tabs.component.css'
})

export class DynamicPageTabsComponent {
  @Input() tabs: { id: string | number, name: string }[] = [];
  @Input() selectedTabItem: string | number = '';
  @Input() color: any = {};

  @Output() tabChange = new EventEmitter<string | number>();

  hoveredTabItem: string | number | null = null;

  onTabClick(tab: { id: string | number, name: string }): void {
    this.tabChange.emit(tab.id);
  }
}
