import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../interfaces/orders.interface';


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
  selector: 'app-shopping-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-dashboard.component.html',
  styleUrls: ['./shopping-dashboard.component.css'],
  providers: [DatePipe]
})

export class ShoppingDashboardComponent {
  constructor(
    private ordersService: OrdersService,
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService,
    private datePipe: DatePipe,
    private dynamicThemeService: DynamicThemeService,// Copy Paste aquí
    private imageUtil: ImageUtilService// Copy Paste aquí
  ) {}


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

  logoBase64: string = ''; // Asegúrate de asignar el valor base64 de tu logo aquí
  companyName: string = 'Nombre de la Empresa';
  reportTitle: string = 'categorías';
  userName: string = 'Nombre del Usuario'; // Puedes obtenerlo desde tu servicio de autenticación


  selectedOrder: any = null;
  tempOrder: Order | null = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  orderModal: any;
  dataTable: any;
  orders: Order[] = [];
  storeId: number = 2;




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
    this.getSalesByStore();
  }
    
ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();
    this.orderModal = new Modal(document.getElementById('orderModal')!);

    const modalEl = document.getElementById('orderModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedOrder = null;
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

getSalesByStore(): void {
  this.ordersService.getSalesByStore(this.storeId).subscribe({
    next: (data: Order[]) => {
      this.orders = data.map(order => ({
        ...order,
        createdAt: order.createdAt
          ? this.datePipe.transform(order.createdAt, 'dd/MM/yyyy HH:mm') || ''
          : ''
      }));

      console.log('Órdenes cargadas:', this.orders);
      this.redrawTable(); // Inicializa o actualiza la tabla
    },
    error: (err) => {
      console.error('Error al obtener compras:', err);
    }
  });
}

    initDataTable(): void {
    const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    const hora = this.datePipe.transform(new Date(), 'hh:mm a') || '';
    
    this.dataTable = $('#ordersTable').DataTable({
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
      data: this.orders,
  columns: [
  { data: 'id', title: 'ID', visible: false },
  { data: 'storeId', title: 'Tienda', visible: false },
  { data: 'userId', title: 'Usuario', visible: false },
  {
    data: 'saleDate',
    title: 'Fecha de Venta',
    render: function (data: string) {
      const date = new Date(data);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  { data: 'paymentMethod', title: 'Método de Pago' },
  {
    data: 'totalAmount',
    title: 'Total',
    render: $.fn.dataTable.render.number(',', '.', 2, '$')
  },
  {
    data: 'status',
    title: 'Estado',
    render: function(data: boolean, type: any, row: any, meta: any) {
            return data ? '<span class="badge bg-success"><i class="fa-solid fa-check"></i> Activa</span>' : '<span class="badge bg-danger"><i class="fa-solid fa-xmark"></i> Inactiva</span>';
          }
  },
  {
    data: 'createdAt',
    title: 'Creado el',
    render: function (data: string) {
      const date = new Date(data);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  {
    data: null,
    title: 'Acciones',
    orderable: false,
    render: function (data: any, type: any, row: any) {
      return `
         <div class="text-center"><button class="btn btn-sm btn-info btn-see-order" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-order" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-order" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          ` ;
    }
  }
],

      columnDefs: [
        {orderable: false, targets: -1}, 
      ],
      initComplete: () => {
        // Insertar botón "Crear categoría" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddCategory" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear categoría</button>`;
        const btnHtml = `<button id="btnAddOrder" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear order</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddOrder').on('click', () => this.createOrder());
        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editOrder para crear este ejemplo
    seeOrder(order: any): void {
    this.selectedOrder = { ...order };
    this.modalMode = 'view';
    this.orderModal.show();
  }

//ni editar 

createOrder(): void {
  this.selectedOrder = {
    storeId: 2, // ✅ Puedes cambiarlo según el contexto
    userId: null,
    saleDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    paymentMethod: '',
    totalAmount: 0,
    status: true,
    deleted: false,
    createdAt: new Date().toISOString(), // Fecha completa
    saleDetails: []
  };
  this.modalMode = 'create';
  this.orderModal.show();
}




//no tenemos eliminar

    redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.orders);
    this.dataTable.draw();
    this.bindTableActions();
  }

    bindTableActions(): void {
    $('#ordersTable').off('click', '.btn-see-order');
    $('#ordersTable').off('click', '.btn-edit-order');
    $('#ordersTable').off('click', '.btn-delete-order');

    $('#ordersTable').on('click', '.btn-see-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.seeOrder(order);
    });

    $('#ordersTable').on('click', '.btn-edit-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.seeOrder(order);
    });

    $('#ordersTable').on('click', '.btn-delete-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.seeOrder(order);
    });
  }

  saveOrderChanges(): void {
    console.log('Guardando cambios...');
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedOrder) return;
if (this.modalMode === 'edit') {
      this.ordersService.UpdateCategory(this.selectedOrder!.id!, this.selectedOrder!).subscribe(updatedUser => {
        const index = this.orders.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.orders[index] = updatedUser;
        }
        Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
        this.redrawTable();
        this.orderModal.hide();
      });
    } else if (this.orderModal === 'create') {
      this.ordersService.createOrder(this.selectedOrder).subscribe(newOrder => {
        this.orders.push(newOrder);
        Swal.fire('Guardado', 'El nuevo usuario ha sido creado', 'success');
        this.redrawTable();
        this.orderModal.hide();
      });
    }
   }
  }

