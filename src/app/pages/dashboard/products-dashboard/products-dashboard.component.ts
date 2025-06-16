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
import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { DatePipe } from '@angular/common';

import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';
import { ImageUtilService } from '../../../services/image-util.service';
import { DatatableLanguageService } from '../../../services/datatable-language.service';

@Component({
  standalone: true,
  selector: 'app-products-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css'],
  providers: [DatePipe],
})

export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  constructor(
    private productsService: ProductsService,
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService,
    private idiomaService: DatatableLanguageService,
    private datePipe: DatePipe,
    private imageUtil: ImageUtilService,
    private dynamicThemeService: DynamicThemeService,
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
    fontSizeText: '',
  };

  //TAREA: Utilizar localStorage o un servicio para obtener el ID de la tienda actual
  logoBase64: string = ''; // Asegúrate de asignar el valor base64 de tu logo aquí
  companyName: string = 'Nombre de la Empresa';
  reportTitle: string = 'listado de Productos';
  userName: string = 'Nombre del Usuario'; // Puedes obtenerlo desde tu servicio de autenticación

  products: Product[] = [];
  selectedProduct: any = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';
  storeId: number = 2;
  productModal: any;
  dataTable: any;
  selectedImageFile: File | null = null;

  ngOnInit(): void {
    this.dynamicThemeService.getDarkMode().subscribe((isDark) => {
      console.log('StoresDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.dynamicThemeService.getSection('pageContent').subscribe((colors) => {
      console.log('StoresDashboardComponent detectó pageContent:', colors);

      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });

    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();
    this.productModal = new Modal(document.getElementById('productModal')!);

    const modalEl = document.getElementById('productModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedProduct = null;
      this.modalMode = 'view';
    });

    this.imageUtil
      .convertImageToBase64('assets/logos/company-logo.png')
      .then((base64) => {
        this.logoBase64 = base64;
        this.initDataTable();
      });
  }

  // ========== CONSULTA DE PRODUCTOS ==========

  getProducts(): void {
    this.productsService.getProductsByPage(this.storeId, 1, 100).subscribe({
      next: (data) => {
        this.products = data?.content || [];
        console.log('Productos obtenidos:', data);
        //this.products = data;
        this.redrawTable();
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }

  // ========== INICIALIZAR Y GESTIONAR DATATABLE ==========

  initDataTable(): void {
    const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    const hora = this.datePipe.transform(new Date(), 'hh:mm a') || '';

    this.dataTable = $('#productsTable').DataTable({
      language: this.idiomaService.getIdioma(),
      dom:
        "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
        "<'row'<'col-12'tr>>" +
        "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      order: [[0, 'asc']],
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
          title: '',
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
              },
            },
          },
          customize: (doc: any) => {
            const fechaHora =
              this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';

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
                  body[i][j].noWrap = !(j === 0 || j === 1);
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
      data: this.products,
      columns: [
        { data: 'name', title: 'Nombre' },
        { data: 'description', title: 'Descripción' },
        { data: 'price', title: 'Precio' },
        /*{
          data: 'image',
          title: 'Imagen',
          render: (data: string) => `
            <img src="${data}" alt="Imagen del producto" width="60" height="60" 
                style="object-fit: cover; border-radius: 8px;" />
          `,
        },*/
        { data: 'stock', title: 'Inventario' },
        {
          data: 'status',
          render: function (data: boolean, type: any, row: any, meta: any) {
            return data
              ? '<span class="badge bg-success"><i class="fa-solid fa-check"></i> Activa</span>'
              : '<span class="badge bg-danger"><i class="fa-solid fa-xmark"></i> Inactiva</span>';
          },
        },
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
          `,
        },
      ],
      initComplete: () => {
        $('.custom-button-col').append(
          `<button id="btnAddProduct" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear producto</button>`,
        );
        $('#btnAddProduct').on('click', () => this.createProduct());
        this.bindTableActions();
      },
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
    $('#productsTable')
      .off('click', '.btn-see-product')
      .off('click', '.btn-edit-product')
      .off('click', '.btn-delete-product');

    $('#productsTable').on('click', '.btn-see-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find((p) => p.id === id);
      if (product) this.seeProduct(product);
    });

    $('#productsTable').on('click', '.btn-edit-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find((p) => p.id === id);
      if (product) this.editProduct(product);
    });

    $('#productsTable').on('click', '.btn-delete-product', (e) => {
      const id = +$(e.currentTarget).data('id');
      const product = this.products.find((p) => p.id === id);
      if (product) this.deleteProduct(product);
    });
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

  createProduct(): void {
    this.selectedProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      status: true,
    };
    this.modalMode = 'create';
    this.productModal.show();
  }

  saveProductChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;
    form.classList.add('was-validated');
  
    if (!this.bootstrapValidation.validateForm(form)) return;
    if (!this.selectedProduct) return;
    
    const productData = {
      storeId: this.selectedProduct.storeId = 2,
      categoryId: this.selectedProduct.categoryId = 1,
      userId: 7,
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      stock: this.selectedProduct.stock,
      url: this.selectedProduct.url || '',
      ratingRate: this.selectedProduct.ratingRate,
      ratingCount: this.selectedProduct.ratingCount,
      status: true
    };

    const transformedData = {
      store: { id: this.selectedProduct.storeId },
      category: { id: this.selectedProduct.categoryId },
      user: { id: this.selectedProduct.userId },
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      stock: this.selectedProduct.stock,
      url: this.selectedProduct.url,
      ratingRate: this.selectedProduct.ratingRate,
      ratingCount: this.selectedProduct.ratingCount,
      status: this.selectedProduct.status
    };

    const formData = new FormData();
    console.log('Creando producto con el formaData');
    const jsonBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
    formData.append('product', jsonBlob);

    if (this.selectedImageFile) {
      formData.append('file', this.selectedImageFile);
    }
  
    formData.forEach((value, key) => {
      console.log('KEY:', key);
      if (value instanceof Blob) {
        value.text().then((text) => console.log('BLOB VALUE:', text));
      } else {
        console.log('VALUE:', value);
      }
    });
  
    if (this.modalMode === 'create') {
      this.productsService.createProduct(formData).subscribe({
        next: (data) => {
          console.log('Producto creado:', data);
          this.products.push(data);
          this.redrawTable();
          this.productModal.hide();
          Swal.fire('Éxito', 'Producto creado correctamente', 'success');
          this.selectedImageFile = null;
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', err.error?.message || 'Error al crear el producto', 'error');
        },
      });
    } else if (this.modalMode === 'edit' && this.selectedProduct.id) {
      this.productsService.updateProduct(this.selectedProduct.id, transformedData).subscribe({
        next: (data) => {
          console.log('Producto actualizado:', data);
          const index = this.products.findIndex((p) => p.id === data.id);
          if (index !== -1) this.products[index] = data;
          this.redrawTable();
          this.productModal.hide();
          Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
          this.selectedImageFile = null;
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', err.error?.message || 'Error al actualizar el producto', 'error');
        },
      });
    }
  }

  deleteProduct(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(product.id!).subscribe(() => {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.redrawTable();
          Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
        });
      }
    });
  }

  handleImageUpload(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      console.log('Imagen cargada:', file);

      // Cargar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleImageUpload({ target: { files } } as any);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onSelectImage(event: MouseEvent): void {
    event.preventDefault();
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    fileInput?.click();
  }
}
