import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5'; 
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-buttons/js/buttons.colVis.js';
import Swal from 'sweetalert2';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';
import { DatePipe } from '@angular/common';

import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../interfaces/orders.interface';

import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';
import { ImageUtilService } from '../../../services/image-util.service';

@Component({
  standalone: true,
  selector: 'app-orders-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css'],
    providers: [DatePipe]
})
export class OrdersDashboardComponent implements OnInit, AfterViewInit {
  selectedOrder: Order | null = null;
  tempOrder: Order | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';

  orderModal: Modal | undefined;
  dataTable: any;

  orders: Order[] = [];
  storeId: number = 2;
  userId = Number(localStorage.getItem('user_id')) || 0;


  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService,
    private ordersService: OrdersService,
    private datePipe: DatePipe,
    private dynamicThemeService: DynamicThemeService,
    private imageUtil: ImageUtilService
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

   
    logoBase64: string = ''; 
    companyName: string = 'Nombre de la Empresa';
    reportTitle: string = 'listado de Órdenes';
    userName: string = 'Nombre del Usuario'; 

  ngOnInit(): void {
    this.dynamicThemeService.getDarkMode().subscribe(isDark => {
      console.log('StoresDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.dynamicThemeService.getSection('pageContent').subscribe(colors => {
      console.log('StoresDashboardComponent detectó pageContent:', colors);

      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
    this.loadOrders();
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
        this.initDataTable()
      });
  }

  private loadOrders(): void {
    const localOrders = this.loadOrdersFromLocalStorage();
    if (localOrders.length) {
      this.orders = localOrders;
      this.initDataTable();
    } else {
      this.ordersService.getSalesByStore(this.storeId).subscribe({
  next: (data) => {
    this.orders.forEach((order) =>  ({
      ...order,
     storeId: (order as any).store?.id || null
    }));

    this.orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        order.createdAt = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    });

    this.saveOrdersToLocalStorage();  // Guardar en localStorage después de cargar
    this.initDataTable();
  },
  error: (err) => {
    Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
    console.error(err);
  }
});

    }
  }

  private saveOrdersToLocalStorage(): void {
    localStorage.setItem('orders_store_' + this.storeId, JSON.stringify(this.orders));
  }

  private loadOrdersFromLocalStorage(): Order[] {
    const data = localStorage.getItem('orders_store_' + this.storeId);
    return data ? JSON.parse(data) : [];
  }

  private initDataTable(): void {
    const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    const hora = this.datePipe.transform(new Date(), 'hh:mm a') || '';

    if (this.dataTable) {
      this.dataTable.destroy();
      $('#ordersTable').empty();
    }

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
        { data: 'saleDate', title: 'Fecha venta', className: 'text-center',    render: data => this.datePipe.transform(data, 'dd/MM/yyyy') },
        { data: 'paymentMethod', className: 'text-center', title: 'Método de pago' },
        { data: 'totalAmount', className: 'text-center', title: 'Total', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
        { data: 'status', className: 'text-center', title: 'Estado' },
        {
          data: null,
          title: 'Acciones',
          orderable: false,
          className: 'text-center no-export',
          render: (data: any, type: any, row: Order) => `
            <div class="text-center">
              <button class="btn btn-sm btn-info btn-see-order" title="Ver" data-id="${row.id}">
                <i class="fas fa-eye"></i>
              </button>

              <button class="btn btn-sm btn-danger btn-delete-order" title="Eliminar" data-id="${row.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
        }
      ],
      columnDefs: [{ orderable: false, targets: -1 }],
      initComplete: () => {
        const btnHtml = `<button id="btnAddOrder" class="btn btn-success mb-1">
          <i class="fas fa-plus"></i> Crear orden
        </button>`;
        $('.custom-button-col').empty().append(btnHtml);
        $('#btnAddOrder').on('click', () => this.createOrder());
        this.bindTableActions();
      }
    });
  }

  private redrawTable(): void {
    if (!this.dataTable) return;

    this.dataTable.clear();
    this.dataTable.rows.add(this.orders);
    this.dataTable.draw();
    this.bindTableActions();
  }

  private bindTableActions(): void {
    $('#ordersTable').off('click', '.btn-see-order');
    $('#ordersTable').off('click', '.btn-edit-order');
    $('#ordersTable').off('click', '.btn-delete-order');

    $('#ordersTable').on('click', '.btn-see-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(o => o.id === id);
      if (order) this.seeOrder(order);
    });

    $('#ordersTable').on('click', '.btn-edit-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(o => o.id === id);
      if (order) this.editOrder(order);
    });

    $('#ordersTable').on('click', '.btn-delete-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(o => o.id === id);
      if (order) this.deleteOrder(order);
    });
  }
createOrder(): void {
this.selectedOrder = {
  id: 0,
  storeId: this.storeId,
  userId: this.userId,
  saleDate: new Date().toISOString(),
  paymentMethod: 'Efectivo',
  totalAmount: 0,
  status: true,
  deleted: 'false'
};


  this.modalMode = 'create';
  this.orderModal?.show();
}



saveOrderChanges(): void {
  const form = document.querySelector('form.needs-validation') as HTMLFormElement;
  form.classList.add('was-validated');

  if (!this.bootstrapValidation.validateForm(form)) return;
  if (!this.selectedOrder) return;

  console.log('Datos a enviar:', this.selectedOrder);  // <--- aquí

  if (this.modalMode === 'edit') {
    console.warn('Edición aún no implementada para el backend.');
  } else if (this.modalMode === 'create') {
    delete this.selectedOrder.id;
    this.ordersService.createOrder(this.selectedOrder).subscribe({
      next: (createdOrder) => {
        this.orders.push(createdOrder);
        Swal.fire('Guardado', 'La orden ha sido guardada correctamente.', 'success');
        this.orderModal?.hide();
        this.redrawTable();
      },
      error: (error) => {
        console.error('Error al guardar la orden:', error);
        Swal.fire('Error', 'No se pudo guardar la orden. Intenta nuevamente.', 'error');
      }
    });
  }
}



  seeOrder(order: Order): void {
    this.selectedOrder = { ...order };
    this.modalMode = 'view';
    this.orderModal?.show();
  }

  editOrder(order: Order): void {
    this.tempOrder = { ...order };
    this.selectedOrder = { ...this.tempOrder };
    this.modalMode = 'edit';
    this.orderModal?.show();
  }

 deleteOrder(order: Order): void {
  if (order.id === undefined) {
    Swal.fire('Error', 'La orden no tiene un ID válido', 'error');
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Seguro que deseas eliminar la orden con ID ${order.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.ordersService.deleteSale(order.id!).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id);
          this.saveOrdersToLocalStorage();
          this.redrawTable();
          Swal.fire('Eliminado', 'La orden ha sido eliminada', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo eliminar la orden', 'error');
          console.error(err);
        }
      });
    }
  });
}
}
