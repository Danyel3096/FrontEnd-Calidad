import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import 'datatables.net-bs5';
import Swal from 'sweetalert2';

import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';

@Component({
  selector: 'app-shopping-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-dashboard.component.html',
  styleUrls: ['./shopping-dashboard.component.css']
})

export class ShoppingDashboardComponent {
  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService
  ) {}

  selectedOrder: any = null;
  tempOrder: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view';
  orderModal: any;
  dataTable: any;

  orders = [
    { id: 1, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-01' },
    { id: 2, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Inactivo', deleted: false, created_at: '2024-03-05' },
    { id: 3, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-10' },
    { id: 4, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Activo', deleted: false, created_at: '2024-03-15' },
    { id: 5, store_id: 1, seller_id: 1, customer_id: 1, sale_date: '01/05/2025', payment_method: 'OJO', total_amount: 123000, status: 'Inactivo', deleted: false, created_at: '2024-03-20' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.orderModal = new Modal(document.getElementById('orderModal')!);

    const modalEl = document.getElementById('orderModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedOrder = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#ordersTable').DataTable({
      language: this.idioma_esp,
      dom: "<'row'<'col-4'l><'col-4 d-flex justify-content-center'f><'col-4 text-end mb-2'B>>" +
           "<'row'<'col-12'tr>>" +
           "<'row'<'col-3'i><'col-6 d-flex justify-content-center'p><'col-3 text-end custom-button-col mt-2'>>",
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'csv', className: 'btn btn-success', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'excel', className: 'btn btn-info', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'pdf', className: 'btn btn-danger', exportOptions: { columns: ':not(.no-export)' } },
        { extend: 'print', className: 'btn btn-warning', exportOptions: { columns: ':not(.no-export)' } }
      ],
      data: this.orders,
      columns: [
        /*{ data: 'id' },*/
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'sale_date' },
        { data: 'payment_method' },
        { data: 'total_amount' },
        { data: 'status' },
        { data: 'created_at' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-order" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-order" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-order" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear usuario" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddOrder" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear usuario</button>`;
        const btnHtml = `<button id="btnAddOrder" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear usuario</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddOrder').on('click', () => {
          this.createOrder();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

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
      if (order) this.editOrder(order);
    });

    $('#ordersTable').on('click', '.btn-delete-order', (e) => {
      const id = +$(e.currentTarget).data('id');
      const order = this.orders.find(u => u.id === id);
      if (order) this.deleteOrder(order);
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editOrder para crear este ejemplo
  createOrder(): void {
    this.selectedOrder = {
      first_name: '',
      email: '',
      password: '',
      status: 'Activo',
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.orderModal.show();
  }

  seeOrder(order: any): void {
    this.selectedOrder = { ...order };
    this.modalMode = 'view';
    this.orderModal.show();
  }

  editOrder(order: any): void {
    this.tempOrder = { ...order }; // para edición
    this.selectedOrder = { ...this.tempOrder };
    this.modalMode = 'edit';
    this.orderModal.show();
  }

  deleteOrder(order: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${order.first_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orders = this.orders.filter(u => u.id !== order.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  saveOrderChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedOrder) return;

    if (this.modalMode === 'edit') {
      const index = this.orders.findIndex(u => u.id === this.selectedOrder.id);
      if (index !== -1) {
        this.orders[index] = { ...this.selectedOrder };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.orders.length ? Math.max(...this.orders.map(u => u.id)) + 1 : 1;
      const newOrder = { ...this.selectedOrder, id: newId };
      this.orders.push(newOrder);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.orderModal.hide();
  }

  idioma_esp: any = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "Ningún dato disponible en esta tabla",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "«",
        "last": "»",
        "next": ">",
        "previous": "<"
    },
    "aria": {
        "sortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": "Copiar",
        "colvis": "Visibilidad",
        "collection": "Colección",
        "colvisRestore": "Restaurar visibilidad",
        "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
        "copySuccess": {
            "1": "Copiada 1 fila al portapapeles",
            "_": "Copiadas %ds fila al portapapeles"
        },
        "copyTitle": "Copiar al portapapeles",
        "csv": "CSV",
        "excel": "Excel",
        "pageLength": {
            "-1": "Mostrar todas las filas",
            "_": "Mostrar %d filas"
        },
        "pdf": "PDF",
        "print": "Imprimir",
        "renameState": "Cambiar nombre",
        "updateState": "Actualizar",
        "createState": "Crear Estado",
        "removeAllStates": "Remover Estados",
        "removeState": "Remover",
        "savedStates": "Estados Guardados",
        "stateRestore": "Estado %d"
    },
    "autoFill": {
        "cancel": "Cancelar",
        "fill": "Rellene todas las celdas con <i>%d<\/i>",
        "fillHorizontal": "Rellenar celdas horizontalmente",
        "fillVertical": "Rellenar celdas verticalmente"
    },
    "decimal": ",",
    "searchBuilder": {
        "add": "Añadir condición",
        "button": {
            "0": "Constructor de búsqueda",
            "_": "Constructor de búsqueda (%d)"
        },
        "clearAll": "Borrar todo",
        "condition": "Condición",
        "conditions": {
            "date": {
                "before": "Antes",
                "between": "Entre",
                "empty": "Vacío",
                "equals": "Igual a",
                "notBetween": "No entre",
                "not": "Diferente de",
                "after": "Después",
                "notEmpty": "No Vacío"
            },
            "number": {
                "between": "Entre",
                "equals": "Igual a",
                "gt": "Mayor a",
                "gte": "Mayor o igual a",
                "lt": "Menor que",
                "lte": "Menor o igual que",
                "notBetween": "No entre",
                "notEmpty": "No vacío",
                "not": "Diferente de",
                "empty": "Vacío"
            },
            "string": {
                "contains": "Contiene",
                "empty": "Vacío",
                "endsWith": "Termina en",
                "equals": "Igual a",
                "startsWith": "Empieza con",
                "not": "Diferente de",
                "notContains": "No Contiene",
                "notStartsWith": "No empieza con",
                "notEndsWith": "No termina con",
                "notEmpty": "No Vacío"
            },
            "array": {
                "not": "Diferente de",
                "equals": "Igual",
                "empty": "Vacío",
                "contains": "Contiene",
                "notEmpty": "No Vacío",
                "without": "Sin"
            }
        },
        "data": "Data",
        "deleteTitle": "Eliminar regla de filtrado",
        "leftTitle": "Criterios anulados",
        "logicAnd": "Y",
        "logicOr": "O",
        "rightTitle": "Criterios de sangría",
        "title": {
            "0": "Constructor de búsqueda",
            "_": "Constructor de búsqueda (%d)"
        },
        "value": "Valor"
    },
    "searchPanes": {
        "clearMessage": "Borrar todo",
        "collapse": {
            "0": "Paneles de búsqueda",
            "_": "Paneles de búsqueda (%d)"
        },
        "count": "{total}",
        "countFiltered": "{shown} ({total})",
        "emptyPanes": "Sin paneles de búsqueda",
        "loadMessage": "Cargando paneles de búsqueda",
        "title": "Filtros Activos - %d",
        "showMessage": "Mostrar Todo",
        "collapseMessage": "Colapsar Todo"
    },
    "select": {
        "cells": {
            "1": "1 celda seleccionada",
            "_": "%d celdas seleccionadas"
        },
        "columns": {
            "1": "1 columna seleccionada",
            "_": "%d columnas seleccionadas"
        },
        "rows": {
            "1": "1 fila seleccionada",
            "_": "%d filas seleccionadas"
        }
    },
    "thousands": ".",
    "datetime": {
        "previous": "Anterior",
        "hours": "Horas",
        "minutes": "Minutos",
        "seconds": "Segundos",
        "unknown": "-",
        "amPm": [
            "AM",
            "PM"
        ],
        "months": {
            "0": "Enero",
            "1": "Febrero",
            "10": "Noviembre",
            "11": "Diciembre",
            "2": "Marzo",
            "3": "Abril",
            "4": "Mayo",
            "5": "Junio",
            "6": "Julio",
            "7": "Agosto",
            "8": "Septiembre",
            "9": "Octubre"
        },
        "weekdays": {
            "0": "Dom",
            "1": "Lun",
            "2": "Mar",
            "4": "Jue",
            "5": "Vie",
            "3": "Mié",
            "6": "Sáb"
        },
        "next": "Próximo"
    },
    "editor": {
        "close": "Cerrar",
        "create": {
            "button": "Nuevo",
            "title": "Crear Nuevo Registro",
            "submit": "Crear"
        },
        "edit": {
            "button": "Editar",
            "title": "Editar Registro",
            "submit": "Actualizar"
        },
        "remove": {
            "button": "Eliminar",
            "title": "Eliminar Registro",
            "submit": "Eliminar",
            "confirm": {
                "_": "¿Está seguro de que desea eliminar %d filas?",
                "1": "¿Está seguro de que desea eliminar 1 fila?"
            }
        },
        "error": {
            "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
        },
        "multi": {
            "title": "Múltiples Valores",
            "restore": "Deshacer Cambios",
            "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo.",
            "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, haga clic o pulse aquí, de lo contrario conservarán sus valores individuales."
        }
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
    "stateRestore": {
        "creationModal": {
            "button": "Crear",
            "name": "Nombre:",
            "order": "Clasificación",
            "paging": "Paginación",
            "select": "Seleccionar",
            "columns": {
                "search": "Búsqueda de Columna",
                "visible": "Visibilidad de Columna"
            },
            "title": "Crear Nuevo Estado",
            "toggleLabel": "Incluir:",
            "scroller": "Posición de desplazamiento",
            "search": "Búsqueda",
            "searchBuilder": "Búsqueda avanzada"
        },
        "removeJoiner": "y",
        "removeSubmit": "Eliminar",
        "renameButton": "Cambiar Nombre",
        "duplicateError": "Ya existe un Estado con este nombre.",
        "emptyStates": "No hay Estados guardados",
        "removeTitle": "Remover Estado",
        "renameTitle": "Cambiar Nombre Estado",
        "emptyError": "El nombre no puede estar vacío.",
        "removeConfirm": "¿Seguro que quiere eliminar %s?",
        "removeError": "Error al eliminar el Estado",
        "renameLabel": "Nuevo nombre para %s:"
    },
    "infoThousands": "."
  }
}
