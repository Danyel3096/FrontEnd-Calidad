import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ProductsService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import Swal from 'sweetalert2';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'app-products-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  // ========== PROPIEDADES ==========
  products: Product[] = [];
  selectedProduct: any = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  storeId: number = 2;
  productModal: any;
  dataTable: any;
  selectedImageFile: File | null = null; // NUEVA propiedad para imagen

  constructor(private productsService: ProductsService) {}

  // ========== CICLO DE VIDA ==========

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.productModal = new Modal(document.getElementById('productModal')!);
    this.initDataTable();
  }

  // ========== CONSULTA DE PRODUCTOS ==========

  getProducts(): void {
    this.productsService.getProductsByStore(this.storeId).subscribe({
      next: (data) => {
        this.products = data;
        this.redrawTable();
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }

  // ========== INICIALIZAR Y GESTIONAR DATATABLE ==========

  initDataTable(): void {
    this.dataTable = $('#productsTable').DataTable({
      dom: "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
           "<'row'<'col-12'tr>>" +
           "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      order: [[0, 'asc']], // Ordenar por ID ascendente
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      data: this.products,
columns: [
  // ID oculto, pero disponible para acciones
  { data: 'id', visible: false, searchable: false, orderable: false },

  // Imagen del producto
  

  // Datos visibles
  { data: 'name', title: 'Nombre' },
  { data: 'description', title: 'Descripción' },
  { data: 'price', title: 'Precio' },
  { data: 'stock', title: 'Stock' },
  {
    data: 'url',
    title: 'Imagen',
    render: (data: string) => `
      <img src="${data}" alt="Imagen del producto" width="60" height="60" 
           style="object-fit: cover; border-radius: 8px;" />
    `
  },
  

  // Campos ocultos
  { data: 'status', visible: false, searchable: false, orderable: false  },
  { data: 'ratingRate', visible: false, searchable: false, orderable: false },
  { data: 'ratingCount', visible: false, searchable: false, orderable: false },

  // Acciones
  {
    data: null,
    title: 'Acciones',
    orderable: false,
    className: 'text-center',
    render: (data: any, type: any, row: any) => `
      <button class="btn btn-sm btn-info btn-see-product" title="Ver" data-id="${row.id}">
        <i class="fas fa-eye"></i>
      </button>
      <button class="btn btn-sm btn-warning btn-edit-product" title="Editar" data-id="${row.id}">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger btn-delete-product" title="Eliminar" data-id="${row.id}">
        <i class="fas fa-trash"></i>
      </button>
    `
  }
]
,

      initComplete: () => {
        $('.custom-button-col').append(`<button id="btnAddProduct" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear producto</button>`);
        $('#btnAddProduct').on('click', () => this.createProduct());
        this.bindTableActions();
      }
    });
  }

  redrawTable(): void {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.products);
      this.dataTable.draw();
      this.bindTableActions();
    }
  }

  bindTableActions(): void {
    $('#productsTable').off('click', '.btn-see-product')
                       .off('click', '.btn-edit-product')
                       .off('click', '.btn-delete-product');

    $('#productsTable').on('click', '.btn-see-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.seeProduct(product);
    });

    $('#productsTable').on('click', '.btn-edit-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.editProduct(product);
    });

    $('#productsTable').on('click', '.btn-delete-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find(p => p.id === id);
      if (product) this.deleteProduct(product);
    });
  }

  // ========== MODAL: VER, EDITAR, CREAR ==========

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

  createProduct(): void {
    this.selectedProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      url: '',
      status: true
      
    };
    this.modalMode = 'create';
    this.productModal.show();
  }

  // ========== GUARDAR CAMBIOS ==========

// ========== GUARDAR CAMBIOS ==========

  saveProductChanges(): void {
    const formData = new FormData();

    // Agregar campos al formData
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price);
    formData.append('stock', this.selectedProduct.stock);
    formData.append('status', this.selectedProduct.status);

    // Agregar imagen si existe
    if (this.selectedImageFile) {
      formData.append('image', this.selectedProduct.url);
    }

    if (this.modalMode === 'create') {
      this.productsService.createProduct(formData).subscribe({
        next: (data) => {
          this.products.push(data);
          this.redrawTable();
          this.productModal.hide();
          Swal.fire('Éxito', 'Producto creado correctamente', 'success');
          this.selectedImageFile = null; // limpiar imagen seleccionada
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al crear el producto', 'error');
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedProduct.id) {
      this.productsService.updateProduct(this.selectedProduct.id, formData).subscribe({
        next: (data) => {
          const index = this.products.findIndex(p => p.id === data.id);
          if (index !== -1) this.products[index] = data;
          this.redrawTable();
          this.productModal.hide();
          Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
          this.selectedImageFile = null;
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
        }
      });
    }
  }




  // ========== ELIMINAR PRODUCTO ==========

  deleteProduct(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(product.id!).subscribe(() => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
        });
      }
    });
  }

  // ========== SUBIDA DE IMAGEN ==========
  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Imagen cargada:', file);
      // Aquí iría tu lógica para guardar/cargar la imagen
    }
  }
}
