import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net-bs5';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css']
})
export class UsersAdminDashboardComponent implements OnInit, AfterViewInit {

  selectedUser: any = null;
  modalMode: 'view' | 'edit' = 'view';
  userModal: any;
  dataTable: any;

  users = [
    { id: 1, user: 'Juan', email: 'juan@mail.com', password: '1234', status: 'Activo', creationDate: '2024-03-01' },
    { id: 2, user: 'Maria', email: 'maria@mail.com', password: 'abcd', status: 'Inactivo', creationDate: '2024-03-05' },
    { id: 3, user: 'Carlos', email: 'carlos@mail.com', password: '5678', status: 'Activo', creationDate: '2024-03-10' },
    { id: 4, user: 'Joan', email: 'joan@mail.com', password: 'efgh', status: 'Activo', creationDate: '2024-03-15' },
    { id: 5, user: 'Sebastian', email: 'sebastian@mail.com', password: 'ijkl', status: 'Inactivo', creationDate: '2024-03-20' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.userModal = new Modal(document.getElementById('userModal')!);
    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#usersTable').DataTable({
      data: this.users,
      columns: [
        { data: 'id' },
        { data: 'user' },
        { data: 'email' },
        { data: 'status' },
        { data: 'creationDate' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-user" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-user" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-user" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      initComplete: () => {
        this.bindTableActions();
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.users);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#usersTable').off('click', '.btn-see-user');
    $('#usersTable').off('click', '.btn-edit-user');
    $('#usersTable').off('click', '.btn-delete-user');

    $('#usersTable').on('click', '.btn-see-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.seeUser(user);
    });

    $('#usersTable').on('click', '.btn-edit-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.editUser(user);
    });

    $('#usersTable').on('click', '.btn-delete-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find(u => u.id === id);
      if (user) this.deleteUser(user);
    });
  }

  seeUser(user: any): void {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  editUser(user: any): void {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.user}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    const index = this.users.findIndex(u => u.id === this.selectedUser.id);
    if (index !== -1) {
      this.users[index] = { ...this.selectedUser };
      this.redrawTable();
    }

    this.userModal.hide();
  }
}
