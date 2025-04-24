import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import Swal from 'sweetalert2';
import { ProductsService } from '../../../../services/product.service';
import { Product } from '../../../../interfaces/product.interface';


@Component({
  standalone: true,
  selector: 'app-inventory-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css']
})
export class InventoryAdminDashboardComponent implements OnInit, AfterViewInit {
  selectedProduct: Product | null = null;
  modalMode: 'view' | 'edit' = 'view';
  productModal: any;
  products: Product[] = [];
  dataTable: any;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.productModal = new Modal(document.getElementById('productModal')!);
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.initDataTable();
    });
  }

  initDataTable(): void {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().clear().destroy();
      }

      this.dataTable = $('#myTable').DataTable({
        dom: "<'row'<'col-4'l><'col-4 text-center'B><'col-4'f>>" +
             "<'row'<'col-12'tr>>" +
             "<'row'<'col-5'i><'col-7'p>>",
        buttons: [
          { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
          { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
          { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
          { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
          { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
        ],
        columnDefs: [{ orderable: false, targets: -1 }]
      });
    }, 0);
  }

  seeProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.modalMode = 'view';
    this.productModal.show();
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.modalMode = 'edit';
    this.productModal.show();
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que deseas eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeProduct(productId);
        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
      }
    });
  }

  removeProduct(productId: number): void {
    this.products = this.products.filter(p => p.id !== productId);
    this.initDataTable(); // Recargar la tabla después de eliminar
  }
}
