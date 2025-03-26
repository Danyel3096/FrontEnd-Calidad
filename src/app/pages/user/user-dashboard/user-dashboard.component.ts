import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap'; // Importamos Modal de Bootstrap
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectedUser: any = null; // Usuario seleccionado para ver/editar
  modalMode: 'view' | 'edit' = 'view'; // Modo del modal (ver o editar)
  userModal: any; // Referencia al modal

  users = [
    { id: 1, name: 'Juan', description: 'Lorem ipsum A' },
    { id: 2, name: 'Maria', description: 'Lorem ipsum B' },
    { id: 3, name: 'Carlos', description: 'Lorem ipsum C' },
    { id: 4, name: 'Joan', description: 'Lorem ipsum D' },
    { id: 5, name: 'Sebastian', description: 'Lorem ipsum E' }
  ];

  ngAfterViewInit(): void {
    this.userModal = new Modal(document.getElementById('userModal')!); // Inicializar el modal
    $('#myTable').DataTable({
      dom: 
      "<'row'<'col-4'l><'col-4 text-center'B><'col-4'f>>" + // l = selector de cantidad de registros, B = botones de exportación, alineados al centro, f = búsqueda
      "<'row'<'col-12'tr>>" +            // Tabla
      "<'row'<'col-5'i><'col-7'p>>", // i = información, p = paginación
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' }}, // Excluye la columna con clase "no-export" 
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' }}, // Excluye la columna con clase "no-export" 
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' }}, // Excluye la columna con clase "no-export" 
        { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' }}, // Excluye la columna con clase "no-export" 
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' }} // Excluye la columna con clase "no-export" 
      ],  // Activa los botones de exportación
      columnDefs: [
        { orderable: false, targets: -1 } // Evita ordenar la columna de acciones
      ]
    });
  }

  // Mostrar modal en modo ver
  seeProduct(user: any) {
    //console.log('See Product with ID:', user);
    
    this.selectedUser = { ...user };
    
    this.modalMode = 'view';
    this.userModal.show();
  }

   // Mostrar modal en modo editar
   editProduct(user: any) {
    console.log('Edit Product with ID:', user.id);
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  // Confirmar eliminación con un alert
  deleteProduct(user: any) {
    console.log('"Delete" Product with ID:', user.id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUsuario(user);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }
  

  // Eliminar usuario
  eliminarUsuario(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
  }

}
