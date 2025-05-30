import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
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

import { DynamicThemeService } from '../../../services/dynamic-theme.service';// Copy Paste aquí
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';// Copy Paste aquí

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
  providers: [DatePipe],
})
export class UsersDashboardComponent implements OnInit, AfterViewInit {
  // ========== PROPIEDADES ==========
  // @ViewChild para el input de archivo
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
      private usersService: UserService,
      private bootstrapInit: BootstrapInitService,
      private bootstrapValidation: BootstrapValidationService,
      private idiomaService: DatatableLanguageService,
      private datePipe: DatePipe,
      private imageUtil: ImageUtilService,
      private dynamicThemeService: DynamicThemeService,// Copy Paste aquí
      private cdRef: ChangeDetectorRef,
  ) {}

  // Copy Paste desde aquí
  pageContentColors: ThemeColors['pageContent'] = {
      backgroundPage: '',
      backgroundSecondary: '',
      textTitle: '',
      textBody: '',
      fontFamily: '',
      fontSizeH1: '',
      fontSizeH2: '',
      fontSizeH3: '',
      fontSizeH4: '',
      fontSizeH5: '',
      fontSizeH6: '',
      fontSizeText: ''
    };
    // Copy Paste hasta aquí

  selectedUser: User | null = null;
  tempUser: User | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  userModal: any;
  dataTable: any;
  users: User[] = [];
  storeId: number = 2;

  //TAREA: Utilizar localStorage o un servicio para obtener el ID de la tienda actual
  logoBase64: string = ''; // Asegúrate de asignar el valor base64 de tu logo aquí
  companyName: string = 'Nombre de la Empresa';
  reportTitle: string = 'usuarios';
  userName: string = 'Nombre del Usuario'; // Puedes obtenerlo desde tu servicio de autenticación

  ngOnInit(): void {
    // Copy Paste desde aquí
    this.dynamicThemeService.getDarkMode().subscribe(isDark => {
      console.log('StoresDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.dynamicThemeService.getSection('pageContent').subscribe(colors => {
      console.log('StoresDashboardComponent detectó pageContent:', colors);
      // Aplica los estilos globales al body o al root
      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
    // Copy Paste hasta aquí
    
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

    this.imageUtil
      .convertImageToBase64('assets/logos/company-logo.png')
      .then((base64) => {
        this.logoBase64 = base64;
        this.initDataTable(); // Asegúrate de llamar después de cargar el logo
      });

    //this.initDataTable();
  }

  getUsers(): void {
    this.usersService.getUsersByStore(this.storeId).subscribe({
      next: (data) => {
        this.users = data;
        this.users.forEach((user) => {
          if (user.createdAt) {
            const date = new Date(user.createdAt);
            user.createdAt = date.toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        });
        console.log('Usuarios cargados:', this.users);
        this.redrawTable();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      },
    });
  }

  initDataTable(): void {
    //const nombreUsuario = 'Juan Pérez'; // Puedes reemplazarlo con tu variable dinámica
    const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    const hora = this.datePipe.transform(new Date(), 'hh:mm a') || '';
    //const fechaHora = new Date().toLocaleString();

    this.dataTable = $('#usersTable').DataTable({
      language: this.idiomaService.getIdioma(),
      dom:
        "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
        "<'row'<'col-12'tr>>" +
        "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      buttons: [
        {
          extend: 'excel',
          className: 'btn btn-info',
          exportOptions: { columns: ':not(.no-export)' },
        },
        {
          extend: 'csv',
          className: 'btn btn-success',
          exportOptions: { columns: ':not(.no-export)' },
        },
        {
          extend: 'print',
          className: 'btn btn-warning',
          exportOptions: { columns: ':not(.no-export)' },
        },
        {
          extend: 'copy',
          className: 'btn btn-primary',
          exportOptions: { columns: ':not(.no-export)' },
        },
        { extend: 'colvis', className: 'btn btn-secondary', text: 'Columnas' },
        {
          extend: 'pdf',
          className: 'btn btn-danger',
          title: '', // ← Esto evita que ponga "Dashboard component" como título
          exportOptions: {
            columns: function (idx: any, data: any, node: any) {
              return $(node).is(':visible') && !$(node).hasClass('no-export');
            },
          },
          customize: (doc: any) => {
            //const nombreUsuario = 'Juan Pérez'; // Puedes reemplazarlo con tu variable dinámica
            const fechaHora =
              this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
            //const fechaHora = new Date().toLocaleString();

            doc.pageOrientation = 'landscape';
            doc.pageMargins = [20, 30, 20, 30]; // Margen general (top, left, bottom, right)
            doc.defaultStyle.fontSize = 10;
            //doc.styles.tableHeader.fontSize = 11;
            //doc.styles.tableHeader.bold = true;

            // Encabezado: Logo y título
            doc.content.unshift({
              columns: [
                {
                  image: this.logoBase64,
                  width: 60,
                },
                {
                  text: [
                    {
                      text: `${this.companyName}\n`,
                      bold: true,
                      italics: true,
                    },
                    {
                      text: `El presente reporte corresponde al listado de ${this.reportTitle}`,
                    },
                  ],
                  alignment: 'right',
                  margin: [10, 0],
                  fontSize: 12,
                },
              ],
              margin: [0, 0, 0, 10],
            });

            // Encabezado
            //doc.header = getPdfHeader(this.logoBase64, this.companyName, this.reportTitle);

            doc.footer = (currentPage: number, pageCount: number) => ({
              columns: [
                {
                  text: `Generado por: ${this.userName}`,
                  alignment: 'left',
                  margin: [40, 0],
                  italics: true,
                },
                {
                  text: `Fecha: ${fecha} a las ${hora}`,
                  alignment: 'right',
                  margin: [0, 0, 40, 0],
                  italics: true,
                },
              ],
              fontSize: 9,
            });
            // Pie de página
            //doc.footer = getPdfFooter(this.userName, fechaHora);

            // Estilo de tabla
            // Asegura que la tabla use el 100% del ancho disponible
            const table = doc.content.find((el: any) => el.table);
            const body = table.table.body;
            const colCount = body[0].length;
            table.table.widths = Array(colCount).fill('*'); // Asignar ancho proporcional a columnas
            table.width = 700; // fuerza un ancho menor que el total de la hoja

            // Centrar contenido en celdas (excepto cabecera si prefieres alineación distinta)
            for (let i = 1; i < body.length; i++) {
              for (let j = 0; j < body[i].length; j++) {
                if (typeof body[i][j] === 'string') {
                  body[i][j] = {
                    text: body[i][j],
                    alignment: 'center',
                    noWrap: true,
                  };
                } else if (typeof body[i][j] === 'object') {
                  body[i][j].alignment = 'center';
                  body[i][j].noWrap = true;
                }
              }
            }
          },
        },
      ],
      data: this.users,
      columns: [
        { data: 'firstName' },
        { data: 'lastName' },
        { data: 'email' },
        {
          data: 'status',
          render: (data) => (data ? 'Activo' : 'Inactivo'),
        },
        { data: 'address' },
        {
          data: 'createdAt',
          render: (data) => this.datePipe.transform(data, 'dd/MM/yyyy'),
        },
        {
          data: null,
          orderable: false,
          className: 'text-center no-export',
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-user" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-user" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-user" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `,
        },
      ],
      columnDefs: [{ orderable: false, targets: -1 }],
      initComplete: () => {
        const btnHtml = `<button id="btnAddUser" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear usuario</button>`;
        $('.custom-button-col').append(btnHtml);
        $('#btnAddUser').on('click', () => this.createUser());
        this.bindTableActions();
      },
    });
  }

  bindTableActions(): void {
    $('#usersTable').off('click', '.btn-see-user');
    $('#usersTable').off('click', '.btn-edit-user');
    $('#usersTable').off('click', '.btn-delete-user');

    $('#usersTable').on('click', '.btn-see-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find((u) => u.id === id);
      if (user) this.seeUser(user);
    });

    $('#usersTable').on('click', '.btn-edit-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find((u) => u.id === id);
      if (user) this.editUser(user);
    });

    $('#usersTable').on('click', '.btn-delete-user', (e) => {
      const id = +$(e.currentTarget).data('id');
      const user = this.users.find((u) => u.id === id);
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
        minute: '2-digit',
      }),
      photoUrl: '',
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(user.id!).subscribe(() => {
          this.users = this.users.filter((u) => u.id !== user.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        });
      }
    });
  }



  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file && this.selectedUser) {
      this.selectedUser.photo = file; // Guarda el archivo


    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const preview = reader.result as string;
      if (this.selectedUser !== null) {
        this.selectedUser.photoUrl = preview;
        this.selectedUser.photoUrl = e.target.result; // Usar photoUrl para la vista previa
        this.cdRef.detectChanges(); // Forzar detección de cambios
        console.log('Imagen cargada:', this.selectedUser.photoUrl); // Debug
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
    };
      reader.readAsDataURL(file);
    }
  }

  saveUserChanges(): void {
    const form = document.querySelector(
      'form.needs-validation',
    ) as HTMLFormElement;
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

      this.usersService
        .updateUser(this.selectedUser.id!, this.selectedUser!)
        .subscribe({
          next: (updatedUser: UserWithMessage) => {
            const index = this.users.findIndex((u) => u.id === updatedUser.id);
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
              },
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
              },
            });
          },
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
            },
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
            },
          });
        },
      });
    }
  }
  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.users);
    this.dataTable.draw();
    this.bindTableActions();
  }

  onSelectImage(event: Event) {
    event.preventDefault(); // Previene el comportamiento por defecto
    this.fileInput.nativeElement.click(); // Activa el input de archivo
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Feedback visual (opcional)
    const dropArea = event.target as HTMLElement;
    dropArea.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Remover feedback visual
    const dropArea = event.target as HTMLElement;
    dropArea.classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Remover clase de feedback
    const dropArea = event.target as HTMLElement;
    dropArea.classList.remove('dragover');

    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      // Reutilizamos el método existente
      const fakeEvent = { target: { files: [file] } } as unknown as Event;
      this.handleImageUpload(fakeEvent);
    }
  }
}
