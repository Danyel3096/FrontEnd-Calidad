import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';
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
  imports: [CommonModule, SidebarComponent, FormsModule],
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  
  constructor(private cdRef: ChangeDetectorRef) { }

  selectedUser: any = null;
  modalMode: 'view' | 'edit' = 'view';
  userModal: any;
  dataTable: any;

  users = [
    { id: 1, name: 'Juan', email: 'juan@example.com', password: '1234', role: 'Admin', active: true },
    { id: 2, name: 'Maria', email: 'maria@example.com', password: '5678', role: 'Usuario', active: false },
    { id: 3, name: 'Carlos', email: 'carlos@example.com', password: 'abcd', role: 'Editor', active: true },
    { id: 4, name: 'Joan', email: 'joan@example.com', password: 'efgh', role: 'Usuario', active: true },
    { id: 5, name: 'Sebastian', email: 'sebas@example.com', password: 'ijkl', role: 'Admin', active: false }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.userModal = new Modal(document.getElementById('userModal')!);
    this.initializeDataTable();
  }

  // Inicializar DataTable
  initializeDataTable(): void {
    setTimeout(() => {
      this.dataTable = $('#myTable').DataTable({
        dom: 
        "<'row'<'col-4'l><'col-4 text-center'B><'col-4'f>>" +
        "<'row'<'col-12'tr>>" +
        "<'row'<'col-5'i><'col-7'p>>",
        buttons: [
          { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' }},
          { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' }},
          { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' }},
          { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' }},
          { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' }}
        ],
        columnDefs: [
          { orderable: false, targets: -1 }
        ],
        data: this.users,
        columns: [
          { data: 'id', title: 'ID' },
          { data: 'name', title: 'Nombre' },
          { data: 'email', title: 'Correo' },
          { data: 'password', title: 'Contraseña' },
          { data: 'role', title: 'Rol' },
          { 
            data: 'active', 
            title: 'Estado', 
            render: (data, type, row) => {
              return data ? '<span class="badge bg-success">Habilitado</span>' 
                          : '<span class="badge bg-danger">Inhabilitado</span>';
            }
          },
          { 
            data: null, 
            title: 'Acciones', 
            orderable: false, 
            render: (data, type, row) => {
              const toggleIcon = row.active ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger';
              return `
                <button class="btn btn-sm btn-outline-primary btn-view" data-id="${row.id}">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="${row.id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-toggle-status" data-id="${row.id}">
                  <i class="fas ${toggleIcon}"></i>
                </button>
              `;
            }
          }
        ]
      });

      this.reassignEventListeners();
    }, 100);
  }

  // Mostrar modal en modo ver
  seeProduct(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  // Mostrar modal en modo editar
  editProduct(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  // Guardar cambios en la edición del usuario
  saveChanges() {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
      }
      this.userModal.hide();
      this.updateTable();
      Swal.fire('Guardado', 'Los cambios han sido guardados', 'success');
    }
  }

  // Habilitar/Inhabilitar usuario con icono dinámico
  toggleUserStatus(user: any) {
    Swal.fire({
      title: user.active ? '¿Inhabilitar usuario?' : '¿Habilitar usuario?',
      text: `¿Estás seguro de que deseas ${user.active ? 'inhabilitar' : 'habilitar'} a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: user.active ? 'Sí, inhabilitar' : 'Sí, habilitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        user.active = !user.active;
        this.updateTable();
        Swal.fire(
          user.active ? 'Usuario habilitado' : 'Usuario inhabilitado',
          `El usuario ${user.name} ha sido ${user.active ? 'habilitado' : 'inhabilitado'}.`,
          'success'
        );
      }
    });
  }

  // Refrescar la tabla sin perder eventos
  updateTable() {
    this.cdRef.detectChanges();
    setTimeout(() => {
      const dataTable = $('#myTable').DataTable();
      dataTable.clear().rows.add(this.users).draw();
      this.reassignEventListeners();
    }, 100);
  }

  // Reasignar eventos a los botones después de actualizar la tabla
  reassignEventListeners() {
    setTimeout(() => {
      $('.btn-view').off('click').on('click', (event) => {
        const userId = $(event.currentTarget).data('id');
        const user = this.users.find(u => u.id === userId);
        if (user) this.seeProduct(user);
      });

      $('.btn-edit').off('click').on('click', (event) => {
        const userId = $(event.currentTarget).data('id');
        const user = this.users.find(u => u.id === userId);
        if (user) this.editProduct(user);
      });

      $('.btn-toggle-status').off('click').on('click', (event) => {
        const userId = $(event.currentTarget).data('id');
        const user = this.users.find(u => u.id === userId);
        if (user) this.toggleUserStatus(user);
      });
    }, 100);
  }
}
