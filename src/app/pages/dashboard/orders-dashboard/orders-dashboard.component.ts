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

import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../interfaces/orders.interface';

@Component({
  standalone: true,
  selector: 'app-orders-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css']
})
export class OrdersDashboardComponent implements OnInit, AfterViewInit {
  selectedOrder: Order | null = null;
  tempOrder: Order | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';

  orderModal: Modal | undefined;
  dataTable: any;

  orders: Order[] = [];
  storeId: number = 2;

  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
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
  }

  private loadOrders(): void {
    const localOrders = this.loadOrdersFromLocalStorage();
    if (localOrders.length) {
      this.orders = localOrders;
      this.initDataTable();
    } else {
      this.ordersService.getSalesByStore(this.storeId).subscribe({
        next: (data: Order[]) => {
          this.orders = data;
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
        { extend: 'copyHtml5', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csvHtml5', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excelHtml5', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdfHtml5', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      data: this.orders,
      columns: [
        { data: 'id' },
        { data: 'storeId' },
        { data: 'userId' },
        { data: 'saleDate' },
        { data: 'paymentMethod' },
        { data: 'totalAmount', render: $.fn.dataTable.render.number(',', '.', 2, '$') },
        { data: 'status' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: Order) => `
            <div class="text-center">
              <button class="btn btn-sm btn-info btn-see-order" title="Ver" data-id="${row.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-warning btn-edit-order" title="Editar" data-id="${row.id}">
                <i class="fas fa-edit"></i>
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
    userId: null,
    saleDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    totalAmount: 0,
    status: 'Activo'
  };
  this.modalMode = 'create';
  this.orderModal?.show();
}


  saveOrderChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) return;
    if (!this.selectedOrder) return;

    if (this.modalMode === 'edit') {
      const index = this.orders.findIndex(o => o.id === this.selectedOrder!.id);
      if (index !== -1) this.orders[index] = { ...this.selectedOrder };
    } else if (this.modalMode === 'create') {
      const newId = this.orders.length ? Math.max(...this.orders.map(o => o.id)) + 1 : 1;
      this.selectedOrder.id = newId;
      this.orders.push(this.selectedOrder);
    }

    this.saveOrdersToLocalStorage();
    Swal.fire('Guardado', 'La orden ha sido guardada correctamente.', 'success');
    this.orderModal?.hide();
    this.redrawTable();
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar la orden con ID ${order.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordersService.deleteSale(order.id).subscribe({
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
