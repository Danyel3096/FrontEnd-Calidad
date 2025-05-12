import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { CategoriesService, Category } from '../../../services/categories-dashboard.service';
import { User } from '../../../interfaces/user.interface';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-categories-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-dashboard.component.html',
  styleUrls: ['./categories-dashboard.component.css']
})
export class CategoriesDashboardComponent implements OnInit, AfterViewInit {
  constructor(private categoriesService: CategoriesService) {}

  selectedCategory: any = null;
  modalMode: 'view' | 'edit' = 'view';
  categoryModal: any;
  dataTable: any;
  categories: Category[] = [];
  storeId: number = 2;

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.categoryModal = new Modal(document.getElementById('categoryModal')!);
    this.initDataTable();
  }

  getCategories(): void {
    this.categoriesService.getCategoriesByStore(this.storeId).subscribe({
      next: (data) => {
        this.categories = data;
        console.log("Categorías cargadas:", this.categories);
        this.redrawTable(); // Inicializa la tabla después de cargar los datos
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  initDataTable(): void {
    this.dataTable = $('#myTable').DataTable({
      dom: "<'row'<'col-4'l> <'col-4 text-center'B> <'col-4'f> <'col-4'>>" +
           "<'row'<'col-12'tr>>" +
           "<'row'<'col-5'i><'col-7'p>>",
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ]
    });
  }

  seeCategory(category: any) {
    this.selectedCategory = { ...category };
    this.modalMode = 'view';
    this.categoryModal.show();
  }

  editCategory(category: any) {
    this.selectedCategory = { ...category };
    this.modalMode = 'edit';
    this.categoryModal.show();
  }

  deleteCategory(category: Category): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${category.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.deleteCategory(category.id!).subscribe(() => {
          this.categories = this.categories.filter(u => u.id !== category.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        });
      }
    });
  }

  removeCategory(categoryId: number) {
    this.categories = this.categories.filter(c => c.id !== categoryId);
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.categories);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#categoriesTable').off('click', '.btn-see-category');
    $('#categoriesTable').off('click', '.btn-edit-category');
    $('#categoriesTable').off('click', '.btn-delete-category');

    $('#categoriesTable').on('click', '.btn-see-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.seeCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-edit-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.editCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-delete-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.deleteCategory(category);
    });
  }
}
