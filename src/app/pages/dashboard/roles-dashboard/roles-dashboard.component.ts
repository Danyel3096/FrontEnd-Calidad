import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

import { RolesDashboardService } from '../../../services/roles-dashboard.service';
import { Role } from '../../../interfaces/role.interface';

import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import Swal from 'sweetalert2';

import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';
import { DatePipe } from '@angular/common';

import { DynamicThemeService } from '../../../services/dynamic-theme.service';// Copy Paste aquí
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';// Copy Paste aquí
import { ImageUtilService } from '../../../services/image-util.service';// Copy Paste aquí


@Component({
  standalone: true,
   selector: 'app-roles-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-dashboard.component.html',
  styleUrls: ['./roles-dashboard.component.css'],
  providers: [DatePipe]
})

export class RolesDashboardComponent implements OnInit, AfterViewInit {

  constructor(
    private RolesDashboardService: RolesDashboardService,
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService,
    private datePipe: DatePipe,
    private dynamicThemeService: DynamicThemeService,// Copy Paste aquí
    private imageUtil: ImageUtilService// Copy Paste aquí
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
  logoBase64: string = ''; // Asegúrate de asignar el valor base64 de tu logo aquí
  companyName: string = 'Nombre de la Empresa';
  reportTitle: string = 'categorías';
  userName: string = 'Nombre del Usuario'; // Puedes obtenerlo desde tu servicio de autenticación


  selectedRole: any = null;
  tempRole: Role | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  roleModal: any;
   dataTable: any;
  roles: Role[] = [];
  storeId: number = 2;

  users = [
    { id: 1, image: '', firstName: 'Juan', lastName: 'Polinecio', email: 'juan@mail.com', address: 'Calle falsa 123', phone: '012345679', password: '1234', role: 'Admin', status: 'Activo', createdAt: '2024-03-01' },
    { id: 2, image: '', firstName: 'Maria', lastName: 'Candela', email: 'maria@mail.com', address: 'Calle falsa 456', phone: '9876543210', password: 'abcd', role: 'Bodeguera', status: 'Inactivo', createdAt: '2024-03-05' },
    { id: 3, image: '', firstName: 'Carlos', lastName: 'Castaño', email: 'carlos@mail.com', address: 'Calle falsa 789', phone: '012345679', password: '5678', role: 'Vendedor', status: 'Activo', createdAt: '2024-03-10' },
    { id: 4, image: '', firstName: 'Joan', lastName: 'Sinner', email: 'joan@mail.com', address: 'Calle mocha ABC', phone: '9876543210', password: 'efgh', role: 'Customer', status: 'Activo', createdAt: '2024-03-15' },
    { id: 5, image: '', firstName: 'Sebastian', lastName: 'ReSinner', email: 'sebastian@mail.com', address: 'Calle mocha DEF', phone: '012345679', password: 'ijkl', role: 'Sinner', status: 'Inactivo', createdAt: '2024-03-20' }
  ];

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
     this.getRoles();

  }
    ngAfterViewInit(): void {

    this.bootstrapInit.initBootstrap();
    this.roleModal = new Modal(document.getElementById('roleModal')!);

    const modalEl = document.getElementById('roleModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedRole = null;
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

    getRoles(): void {
    this.RolesDashboardService.getRolesByStore(this.storeId).subscribe({
      next: (data) => {
        this.roles = data?.content || [];
        console.log("Roles cargadas:", this.roles);
        this.roles.forEach((role) => {
          if (role.createdAt) {
            role.createdAt = this.datePipe.transform(role.createdAt, 'dd/MM/yyyy HH:mm') || '';
          }
        });
        console.log('Roles cargados x2:', this.roles);
        this.redrawTable(); // Inicializa la tabla después de cargar los datos
      },
      error: (err) => {
        console.error('Error al obtener roles:', err);
      }
    });
  }

initDataTable(): void {
    const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    const hora = this.datePipe.transform(new Date(), 'hh:mm a') || '';
    
    this.dataTable = $('#rolesTable').DataTable({
      language: this.idiomaService.getIdioma(),
      dom: "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
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
            format: {
              body: (data: any, row: any, column: any, node: any) => {
                // Elimina HTML y centra
                const div = document.createElement('div');
                div.innerHTML = data;
                return div.textContent?.trim() || '';
              }
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
            
            // Encuentra la tabla y da estilo de tabla
            // Asegura que la tabla use el 100% del ancho disponible
            const table = doc.content.find((el: any) => el.table);
            const body = table.table.body;
            const colCount = body[0].length;
            // Calcular porcentaje para cada columna (en formato '20%' por ejemplo)
            const equalPercent = (100 / colCount).toFixed(2) + '%';
            table.table.widths = Array(colCount).fill(equalPercent);

            // Iterar desde la fila 1 (fila 0 es header)
            for (let i = 1; i < body.length; i++) {
              for (let j = 0; j < body[i].length; j++) {
                if (typeof body[i][j] === 'string') {
                  body[i][j] = {
                    text: body[i][j],
                    alignment: 'center',
                    noWrap: j !== 2, // Solo la columna 2 permite wrap
                  };
                } else if (typeof body[i][j] === 'object') {
                  body[i][j].alignment = 'center';
                  body[i][j].noWrap = j !== 1;
                }
              }
            }

            // Centrar encabezado (fila 0)
            for (let j = 0; j < body[0].length; j++) {
              const cell = body[0][j];
              if (typeof cell === 'string') {
                body[0][j] = {
                  text: cell,
                  alignment: 'center',
                  bold: true,
                };
              } else {
                cell.alignment = 'center';
                cell.bold = true;
              }
            }
          },
        },
      ],
      data: this.roles,
      columns: [
        {data: 'name'},
        {data: 'description'},
        {
          data: 'status',
          render: function(data: boolean, type: any, row: any, meta: any) {
            return data ? '<span class="badge bg-success"><i class="fa-solid fa-check"></i> Activa</span>' : '<span class="badge bg-danger"><i class="fa-solid fa-xmark"></i> Inactiva</span>';
          }
        },
        {
          data: 'createdAt'
        },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-rele" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-role" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-role" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          ` 
        }
      ],
      columnDefs: [
        {orderable: false, targets: -1}, 
      ],
    });
  }

  
   seeRole(role: any): void {
    this.selectedRole = { ...role };
    this.modalMode = 'view';
    this.roleModal.show();
  }
  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.roles);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#rolesTable').off('click', '.btn-see-role');


    $('#rolesTable').on('click', '.btn-see-role', (e) => {
      const id = +$(e.currentTarget).data('id');
      const role = this.roles.find(u => u.id === id);
      if (role) this.seeRole(role);
    });


  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editUser para crear este ejemplo
}
