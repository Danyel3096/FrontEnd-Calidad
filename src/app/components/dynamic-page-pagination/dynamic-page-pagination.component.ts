import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-page-pagination',
  imports: [CommonModule],
  templateUrl: './dynamic-page-pagination.component.html',
  styleUrl: './dynamic-page-pagination.component.css'
})

export class DynamicPagePaginationComponent {

  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Input() color!: {
    background: string;
    hoverBackground: string;
    text: string;
    hoverText: string
  };

  @Output() pageChange = new EventEmitter<number | 'next' | 'previous'>();

  hoveredPage: number | null = null;

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;

    const maxVisible = 10;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - half);
    let end = start + maxVisible - 1;

    // Ajuste si el final se pasa del total
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  onClick(page: number | 'next' | 'previous') {
    this.pageChange.emit(page);
  }
}
