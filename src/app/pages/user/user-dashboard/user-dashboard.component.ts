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

  selectedUser: any = null; // Usuario seleccionado para ver/editar
  modalMode: 'view' | 'edit' = 'view'; // Modo del modal (ver o editar)
  userModal: any; // Referencia al modal

  users = [
    { id: 1, user: 'Juan', email: 'juan@mail.com', password: '1234', status: 'Activo', creationDate: '2024-03-01' },
    { id: 2, user: 'Maria', email: 'maria@mail.com', password: 'abcd', status: 'Inactivo', creationDate: '2024-03-05' },
    { id: 3, user: 'Carlos', email: 'carlos@mail.com', password: '5678', status: 'Activo', creationDate: '2024-03-10' },
    { id: 4, user: 'Joan', email: 'joan@mail.com', password: 'efgh', status: 'Activo', creationDate: '2024-03-15' },
    { id: 5, user: 'Sebastian', email: 'sebastian@mail.com', password: 'ijkl', status: 'Inactivo', creationDate: '2024-03-20' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.userModal = new Modal(document.getElementById('userModal')!); // Inicializar el modal
    $('#myTable').DataTable({
      dom: 
      "<'row'<'col-4'l><'col-4 text-center'B><'col-4'f>>" +
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
        { orderable: false, targets: -1 } // Evita ordenar la columna de acciones
      ]
    });
  }

  // Mostrar modal en modo ver
  seeUser(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  // Mostrar modal en modo editar
  editUser(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  // Confirmar eliminación con un alert
  deleteUser(user: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.user}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeUser(user);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  // Eliminar usuario
  removeUser(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
  }
}

