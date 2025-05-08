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
  standalone: true,
  selector: 'app-categories-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-dashboard.component.html',
  styleUrls: ['./categories-dashboard.component.css']
})

export class CategoriesDashboardComponent implements OnInit, AfterViewInit {
  
  constructor(
    private bootstrapInit: BootstrapInitService,
    private bootstrapValidation: BootstrapValidationService
  ) {}
  
  selectedCategory: any = null; // Categoría seleccionada para ver/editar
  tempCategory: any = null; // para edición
  modalMode: 'view' | 'edit' | 'create' = 'view'; // Modo del modal
  categoryModal: any; // Referencia al modal
  dataTable: any;

  categories = [
    { id: 1, storeId: 101, name: 'Electrónica', description: 'Dispositivos electrónicos', status: 'Activo', creationDate: '2024-03-01' },
    { id: 2, storeId: 102, name: 'Ropa', description: 'Prendas de vestir', status: 'Inactivo', creationDate: '2024-03-05' },
    { id: 3, storeId: 103, name: 'Hogar', description: 'Artículos para el hogar', status: 'Activo', creationDate: '2024-03-10' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.bootstrapInit.initBootstrap();

    this.categoryModal = new Modal(document.getElementById('categoryModal')!);

    const modalEl = document.getElementById('categoryModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectedCategory = null;
      this.modalMode = 'view';
    });

    this.initDataTable();
  }

  initDataTable(): void {
    this.dataTable = $('#categoriesTable').DataTable({
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
      data: this.categories,
      columns: [
        { data: 'id' },
        /*{ 
          data: null,
          render: data => `${data.first_name} ${data.last_name}`
        }*/
        { data: 'first_name' },
        { data: 'last_name' },
        { data: 'email' },
        { data: 'status' },
        { data: 'creationDate' },
        {
          data: null,
          orderable: false,
          render: (data: any, type: any, row: any) => `
            <div class="text-center"><button class="btn btn-sm btn-info btn-see-category" title="Ver" data-id="${row.id}"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-warning btn-edit-category" title="Editar" data-id="${row.id}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btn-delete-category" title="Eliminar" data-id="${row.id}"><i class="fas fa-trash"></i></button></div>
          `
        }
      ],
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      initComplete: () => {
        // Insertar botón "Crear usuario" al centro, junto a los botones de exportación
        //const btnHtml = `<button id="btnAddCategory" class="btn btn-success btn-sm ms-2"><i class="fas fa-plus"></i> Crear usuario</button>`;
        const btnHtml = `<button id="btnAddCategory" class="btn btn-success mb-1"><i class="fas fa-plus"></i> Crear usuario</button>`;
        $('.custom-button-col').append(btnHtml);

        // Asociar evento al nuevo botón
        $('#btnAddCategory').on('click', () => {
          this.createCategory();
        });

        this.bindTableActions(); // tus acciones de ver, editar, eliminar
      }
    });
  }

  redrawTable(): void {
    this.dataTable.clear();
    this.dataTable.rows.add(this.categories);
    this.dataTable.draw();
    this.bindTableActions();
  }

  bindTableActions(): void {
    $('#categoriesTable').off('click', '.btn-see-category');
    $('#categoriesTable').off('click', '.btn-edit-category');
    $('#categoriesTable').off('click', '.btn-delete-category');

    $('#categoriesTable').on('click', '.btn-see-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.seeCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-edit-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.editCategory(category);
    });

    $('#categoriesTable').on('click', '.btn-delete-category', (e) => {
      const id = +$(e.currentTarget).data('id');
      const category = this.categories.find(u => u.id === id);
      if (category) this.deleteCategory(category);
    });
  }

  //OJO: Falta crear la función para crear un nuevo usuario, me basé en editcategory para crear este ejemplo
  createCategory(): void {
    this.selectedCategory = {
      first_name: '',
      email: '',
      password: '',
      status: 'Activo',
      creationDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    this.modalMode = 'create';
    this.categoryModal.show();
  }

  seeCategory(category: any): void {
    this.selectedCategory = { ...category };
    this.modalMode = 'view';
    this.categoryModal.show();
  }

  editCategory(category: any): void {
    this.tempCategory = { ...category }; // para edición
    this.selectedCategory = { ...this.tempCategory };
    this.modalMode = 'edit';
    this.categoryModal.show();
  }

  deleteCategory(category: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar a ${category.first_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categories = this.categories.filter(u => u.id !== category.id);
        this.redrawTable();
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      }
    });
  }

  saveCategoryChanges(): void {
    const form = document.querySelector('form.needs-validation') as HTMLFormElement;

    // Añade la clase que dispara estilos de Bootstrap
    form.classList.add('was-validated');

    if (!this.bootstrapValidation.validateForm(form)) {
      return;
    }

    if (!this.selectedCategory) return;

    if (this.modalMode === 'edit') {
      const index = this.categories.findIndex(u => u.id === this.selectedCategory.id);
      if (index !== -1) {
        this.categories[index] = { ...this.selectedCategory };
      }
    } else if (this.modalMode === 'create') {
      // Generar ID automático (consecutivo)
      const newId = this.categories.length ? Math.max(...this.categories.map(u => u.id)) + 1 : 1;
      const newCategory = { ...this.selectedCategory, id: newId };
      this.categories.push(newCategory);
    }
    
    Swal.fire('Guardado', 'Los cambios han sido guardados correctamente', 'success');
    this.redrawTable();
    this.categoryModal.hide();
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
