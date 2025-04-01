import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
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
  styleUrl: './categories-dashboard.component.css'
})
export class CategoriesAdminDashboardComponent implements OnInit, AfterViewInit {
  constructor() { }
  
  selectedCategory: any = null; // Categoría seleccionada para ver/editar
  modalMode: 'view' | 'edit' = 'view'; // Modo del modal
  categoryModal: any; // Referencia al modal

  categories = [
    { id: 1, storeId: 101, name: 'Electrónica', description: 'Dispositivos electrónicos', status: 'Activo', creationDate: '2024-03-01' },
    { id: 2, storeId: 102, name: 'Ropa', description: 'Prendas de vestir', status: 'Inactivo', creationDate: '2024-03-05' },
    { id: 3, storeId: 103, name: 'Hogar', description: 'Artículos para el hogar', status: 'Activo', creationDate: '2024-03-10' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.categoryModal = new Modal(document.getElementById('categoryModal')!);
    $('#myTable').DataTable({
      dom: "<'row'<'col-4'l><'col-4 text-center'B><'col-4'f>>" +
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

  deleteCategory(categoryId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que deseas eliminar esta categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeCategory(categoryId);
        Swal.fire('Eliminado', 'La categoría ha sido eliminada', 'success');
      }
    });
  }


  removeCategory(categoryId: number) {
    this.categories = this.categories.filter(c => c.id !== categoryId);
  }


}
