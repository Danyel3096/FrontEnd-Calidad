import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import Swal from 'sweetalert2';

import { User } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';
import { DatePipe } from '@angular/common';

import { getPdfHeader, getPdfFooter } from '../../../utils/pdf-utils';
import { ImageUtilService } from '../../../services/image-util.service';

interface UserWithMessage extends User {
  message?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css'],
  providers: [DatePipe]
})

export class UsersDashboardComponent implements OnInit, AfterViewInit {

  constructor(
      private usersService: UserService,
      private bootstrapInit: BootstrapInitService,
      private bootstrapValidation: BootstrapValidationService,
      private idiomaService: DatatableLanguageService,
      private datePipe: DatePipe,
      private imageUtil: ImageUtilService
  ) {}

  selectedUser: User | null = null;
  tempUser: User | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  userModal: any;
  dataTable: any;
  users: User[] = [];
  storeId: number = 2;

  logoBase64: string = ''; // Asegúrate de asignar el valor base64 de tu logo aquí
  companyName: string = 'Nombre de la Empresa';
  reportTitle: string = 'Reporte de Usuarios';
  userName: string = 'Nombre del Usuario'; // Puedes obtenerlo desde tu servicio de autenticación

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();
    this.userModal = new Modal(document.getElementById('userModal')!);

    const modalEl = document.getElementById('userModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedUser = null;
      this.modalMode = 'view';
    });

    this.imageUtil.convertImageToBase64('assets/logos/company-logo.png').then(base64 => {
      this.logoBase64 = base64;
      this.initDataTable(); // Asegúrate de llamar después de cargar el logo
    });

    //this.initDataTable();
  }

  getUsers(): void {
    this.usersService.getUsersByStore(this.storeId).subscribe({
      next: (data) => {
        this.users = data;
        this.users.forEach(user => {
          if (user.createdAt) {
            const date = new Date(user.createdAt);
            user.createdAt = date.toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        });
        console.log("Usuarios cargados:", this.users);
        this.redrawTable();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  initDataTable(): void {
    const fechaHora = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
    
    this.dataTable = $('#usersTable').DataTable({
      language: this.idiomaService.getIdioma(),
      dom: "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
           "<'row'<'col-12'tr>>" +
           "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdf',
          className: 'btn btn-danger',
          exportOptions: { columns: ':not(.no-export)' },
          customize: (doc: any) => {
            doc.pageMargins = [40, 60, 40, 60];
            doc.defaultStyle.fontSize = 10;
            doc.styles.tableHeader.fontSize = 11;
            doc.styles.tableHeader.bold = true;

            // Encabezado
            doc.header = getPdfHeader(this.logoBase64, this.companyName, this.reportTitle);

            // Pie de página
            doc.footer = getPdfFooter(this.userName, fechaHora);
          }
        },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      data: this.users,
      columns: [
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'email' },
        { 
          data: 'status',
          render: data => data ? 'Activo' : 'Inactivo'
        },
        { data: 'address' },
        { 
          data: 'createdAt',
          render: data => this.datePipe.transform(data, 'dd/MM/yyyy')
         },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-user" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-user" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-user" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        const btnHtml = `<button id="btnAddUser" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear usuario</button>`;
        $('.custom-button-col').append(btnHtml);
        $('#btnAddUser').on('click', () => this.createUser());
        this.bindTableActions();
      }
    });
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

  createUser(): void {
    this.selectedUser = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      role: '',
      status: true,
      createdAt: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      photoUrl: ''
    };
    this.modalMode = 'create';
    this.userModal.show();
  }
  

  seeUser(user: User): void {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.userModal.show();
  }

  editUser(user: User): void {
    this.tempUser = { ...user };
    this.selectedUser = { ...this.tempUser };
    this.modalMode = 'edit';
    this.userModal.show();
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${user.firstName} ${user.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(user.id!).subscribe(() => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        });
      }
    });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file && this.selectedUser) {
      this.selectedUser.photo = file;

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        if (this.selectedUser !== null) {
          this.selectedUser.photoUrl = preview;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  

  saveUserChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;
    form.classList.add('was-validated');
  
    if (!this.bootstrapValidation.validateForm(form)) return;
    if (!this.selectedUser) return;
  
    if (this.modalMode === 'edit') {
      this.selectedUser.password = '12345'; // temporal o requerido por el backend
  
      

      /*for (const key in this.selectedUser) {
        const value = (this.selectedUser as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
      */

  
      this.usersService.updateUser(this.selectedUser.id!, this.selectedUser!).subscribe({
        next: (updatedUser: UserWithMessage) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
  
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: `Los cambios han sido guardados correctamente.\nMensaje del servidor: ${updatedUser.message || 'Actualización exitosa.'}`,
            didOpen: () => {
              const titleEl = document.querySelector('.swal2-title');
              if (titleEl) {
                titleEl.setAttribute('style', 'color: black;');
              }
            }
          });
  
          this.redrawTable();
          this.userModal.hide();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo actualizar el usuario.\nMensaje del servidor: ${err.error?.message || 'Error desconocido.'}`,
            didOpen: () => {
              const titleEl = document.querySelector('.swal2-title');
              if (titleEl) {
                titleEl.setAttribute('style', 'color: black;');
              }
            }
          });
        }
      });
  
    } else if (this.modalMode === 'create') {
      this.usersService.createUser(this.selectedUser).subscribe({
        next: (newUser: UserWithMessage) => {
          this.users.push(newUser);
  
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: `El nuevo usuario ha sido creado.\nMensaje del servidor: ${newUser.message || 'Creación exitosa.'}`,
            didOpen: () => {
              const titleEl = document.querySelector('.swal2-title');
              if (titleEl) {
                titleEl.setAttribute('style', 'color: black;');
              }
            }
          });
  
          this.redrawTable();
          this.userModal.hide();
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
  
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo crear el usuario.\nMensaje del servidor: ${err.error?.message || 'Error desconocido.'}`,
            didOpen: () => {
              const titleEl = document.querySelector('.swal2-title');
              if (titleEl) {
                titleEl.setAttribute('style', 'color: black;');
              }
            }
          });
        }
      });
    }
  }
  
  

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.users);
    this.dataTable.draw();
    this.bindTableActions();
  }
}

