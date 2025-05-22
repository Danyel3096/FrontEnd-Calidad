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

  get displayedPagination(): (number | 'prevEllipsis' | 'nextEllipsis')[] {
    const pages: (number | 'prevEllipsis' | 'nextEllipsis')[] = [];

    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 10;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - half);
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('prevEllipsis'); // << Avanzar -10
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total) {
      if (end < total - 1) pages.push('nextEllipsis'); // >> Avanzar +10
      pages.push(total);
    }

    return pages;
  }

  onEllipsisClick(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      const newPage = Math.max(1, this.currentPage - 10);
      this.onClick(newPage);
    } else if (direction === 'next') {
      const newPage = Math.min(this.totalPages, this.currentPage + 10);
      this.onClick(newPage);
    }
  }

  onClick(page: number | 'next' | 'previous') {
    this.pageChange.emit(page);
  }
}
