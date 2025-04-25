import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap'; 
import $ from 'jquery';
import 'datatables.net-bs5';

@Component({
  selector: 'products-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  
  constructor(private cdRef: ChangeDetectorRef) { }

  selectedProduct: any = null;
  modalMode: 'view' | 'edit' = 'view';
  productModal: any;
  dataTable: any;

  products = [
    { id: 1, id_tienda: 101, nombre_producto: 'Laptop Dell', descripcion_producto: 'Laptop Core i7', precio_producto: 2500, stock_producto: 10, id_categoria: 2, id_proveedor: 5, estado: true, fecha_creacion: '2024-03-30', foto_producto: 'assets/img/laptop.jpg' },
    { id: 2, id_tienda: 102, nombre_producto: 'Mouse Gamer', descripcion_producto: 'Mouse RGB', precio_producto: 50, stock_producto: 50, id_categoria: 3, id_proveedor: 2, estado: true, fecha_creacion: '2024-03-28', foto_producto: 'assets/img/mouse.jpg' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.productModal = new Modal(document.getElementById('productModal')!);
  }

  seeProduct(product: any) {
    this.selectedProduct = { ...product };
    this.modalMode = 'view';
    this.productModal.show();
  }

  editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.modalMode = 'edit';
    this.productModal.show();
  }

  saveChanges() {
    if (this.selectedProduct.stock_producto < 0) {
      alert('El stock no puede ser negativo.');
      return;
    }

    if (this.selectedProduct.precio_producto < 0) {
      alert('El precio no puede ser negativo.');
      return;
    }

    this.productModal.hide();
    alert('Cambios guardados.');
   
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.foto_producto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleProductStatus(product: any) {
    product.estado = !product.estado;
    this.cdRef.detectChanges();
  }
}
