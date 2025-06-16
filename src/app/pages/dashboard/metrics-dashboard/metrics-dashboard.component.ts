import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
//import printJS from 'print-js';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { WebsocketService } from '../../../services/websocket.service'; // ajusta la ruta
import { Subscription } from 'rxjs';

import { DynamicThemeService } from '../../../services/dynamic-theme.service';// Copy Paste aquí
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';// Copy Paste aquí

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title
);

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-dashboard.component.html',
  styleUrls: ['./metrics-dashboard.component.css'],
})

export class MetricsDashboardComponent implements AfterViewInit, OnDestroy {
  fechaActual: string = new Date().toLocaleDateString();

  //Propiedades de las instancias de socketticket
  ticketPromedioChart!: Chart;
  ingresosMesChart!: Chart;
  categoriasChart!: Chart;
  topProductosChart!: Chart;
  ingresosVsVentasChart!: Chart;

  mensajesSocket: string[] = [];
  private socketSubscription!: Subscription;

  constructor(
    private dynamicThemeService: DynamicThemeService,// Copy Paste aquí
    private websocketService: WebsocketService
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

    ngOnInit(): void {
    // Copy Paste desde aquí
    this.dynamicThemeService.getDarkMode().subscribe(isDark => {
      console.log('MetricsDashboardComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.dynamicThemeService.getSection('pageContent').subscribe(colors => {
      console.log('MetricsDashboardComponent detectó pageContent:', colors);
      // Aplica los estilos globales al body o al root
      const root = document.documentElement;

      this.pageContentColors = colors;

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    });
    // Copy Paste hasta aquí
    
    //this.getMetrics();
  }

  kpis = [
    { label: 'Ventas del día', value: 35 },
    { label: 'Ingresos del día', value: '$4,500' },
    { label: 'Ventas del mes', value: 530 },
    { label: 'Ingreso del mes', value: '$68,000' },
    { label: 'Promedio ventas del día', value: '$128.50' },
  ];

  dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  ticketPromedioPorDia = [125.5, 130.2, 140.3, 128.9, 132.0, 120.5, 135.7];

  // Obtener el mes y año actuales
  fecha = new Date();
  anioActual = this.fecha.getFullYear();
  mesActual = this.fecha.getMonth(); // 0 = enero

  // Función para obtener la cantidad de días del mes actual
  obtenerDiasDelMes(anio: number, mes: number): number {
    return new Date(anio, mes + 1, 0).getDate();
  }

  totalDias = this.obtenerDiasDelMes(this.anioActual, this.mesActual);

  // Generar los días como "Día 1", "Día 2", ..., según el mes actual
  diasMes = Array.from({ length: this.totalDias }, (_, i) => `Día ${i + 1}`);

  // Generar ingresos aleatorios para cada día
  ingresosDelMes = Array.from({ length: this.totalDias }, () => Math.floor(Math.random() * 2000) + 500);

  categorias = ['Electrónica', 'Ropa', 'Hogar', 'Juguetes'];
  productosPorCategoria = [35, 25, 20, 20];

  topProductos = [
    'Celular Samsung A34',
    'Audífonos Xiaomi',
    'Portátil HP 245 G8',
    'Cámara Canon Rebel T7',
    'Smartwatch Huawei Band 7',
    'Lavadora Haceb 16kg',
    'TV LG 55" 4K',
    'Impresora Epson L3250',
    'Parlante JBL Flip 6',
    'Mouse Logitech M280'
  ];

  ventasTopProductos = [150, 140, 130, 120, 110, 100, 95, 90, 85, 80];

  @ViewChild('ticketPromedioCanvas') ticketPromedioCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosMesCanvas') ingresosMesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriasCanvas') categoriasCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProductosCanvas') topProductosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosVsVentasCanvas') ingresosVsVentasCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.initTicketPromedioChart();
    this.initIngresosMesChart();
    this.initCategoriasChart();
    this.initTopProductosChart();
    this.initIngresosVsVentasChart();
    
    this.iniciarSocket();
  }

  iniciarSocket(): void {
    const socketUrl = 'ws://tdd-billing-backend.onrender.com/ws/statistics';
    
    this.socketSubscription = this.websocketService.connect(socketUrl).subscribe(rawMsg => {
      try {
        const data = JSON.parse(rawMsg);
        
        this.mensajesSocket.push(rawMsg);
        //console.log('📩 Nuevo mensaje recibido:', rawMsg);
        
        this.actualizarDatosConSocket(data); // 👇 función que debes crear
      } catch (e) {
        console.error('Mensaje no JSON:', rawMsg);
      }
    });
  }

  actualizarDatosConSocket(data: any) {
    if (data.kpis) this.kpis = data.kpis;

    // Suponiendo que estos son los únicos valores recibidos por ahora
    if (data.salesToday !== undefined && data.incomeToday !== undefined && data.salesThisMonth !== undefined && data.incomeThisMonth !== undefined) {
      this.kpis = [
        { label: 'Ventas del día', value: data.salesToday },
        { label: 'Ingresos del día', value: `$${data.incomeToday.toFixed(2)}` },
        { label: 'Ventas del mes', value: data.salesThisMonth },
        { label: 'Ingreso del mes', value: `$${data.incomeThisMonth.toFixed(2)}` },
        {
          label: 'Promedio ventas del día',
          value: `$${(data.incomeToday / (data.salesToday || 1)).toFixed(2)}` // Evita división por cero
        }
      ];
    }

    if (data.ticketPromedio) {
      this.ticketPromedioPorDia = data.ticketPromedio;
      this.initTicketPromedioChart(); // O actualiza el chart directamente
    }

    if (data.ingresosMes) {
      this.ingresosDelMes = data.ingresosMes;
      this.initIngresosMesChart();
    }

    if (data.categorias && data.productosPorCategoria) {
      this.categorias = data.categorias;
      this.productosPorCategoria = data.productosPorCategoria;
      this.initCategoriasChart();
    }

    if (data.topProductos && data.ventasTopProductos) {
      this.topProductos = data.topProductos;
      this.ventasTopProductos = data.ventasTopProductos;
      this.initTopProductosChart();
    }

    if (data.ingresosVsVentas) {
      this.initIngresosVsVentasChartDesdeSocket(data.ingresosVsVentas.ingresos, data.ingresosVsVentas.ventas);
    }
  }

  initTicketPromedioChart(): void {
    new Chart(this.ticketPromedioCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dias,
        datasets: [{
          label: 'Ticket Promedio ($)',
          data: this.ticketPromedioPorDia,
          backgroundColor: '#4e73df',
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
      },
    });
  }

  initIngresosMesChart(): void {
    new Chart(this.ingresosMesCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.diasMes,
        datasets: [{
          label: 'Ingresos',
          data: this.ingresosDelMes,
          borderColor: '#36b9cc',
          backgroundColor: 'rgba(54, 185, 204, 0.2)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  initCategoriasChart(): void {
    new Chart(this.categoriasCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.categorias,
        datasets: [{
          data: this.productosPorCategoria,
          backgroundColor: ['#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
        }],
      },
      options: { responsive: true },
    });
  }

  initTopProductosChart(): void {
    new Chart(this.topProductosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.topProductos,
        datasets: [{
          label: 'Ventas',
          data: this.ventasTopProductos,
          backgroundColor: '#36b9cc',
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } },
      },
    });
  }

  initIngresosVsVentasChart(): void {
    new Chart(this.ingresosVsVentasCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dias,
        datasets: [
          {
            label: 'Ingresos',
            data: [1000, 1200, 1400, 1600, 1100, 800, 1900],
            backgroundColor: '#4e73df',
            yAxisID: 'y1',
          },
          {
            label: 'Ventas',
            data: [40, 55, 60, 75, 50, 30, 90],
            backgroundColor: '#1cc88a',
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y1: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Ingresos ($)' },
          },
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Cantidad de Ventas' },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }

  initIngresosVsVentasChartDesdeSocket(ingresos: number[], ventas: number[]): void {
    new Chart(this.ingresosVsVentasCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dias,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            backgroundColor: '#4e73df',
            yAxisID: 'y1',
          },
          {
            label: 'Ventas',
            data: ventas,
            backgroundColor: '#1cc88a',
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y1: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Ingresos ($)' },
          },
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Cantidad de Ventas' },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }


  imprimirMetricas() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      const img = document.createElement('img');
      img.src = (canvas as HTMLCanvasElement).toDataURL();
      img.style.width = '100%';
      img.style.maxHeight = '400px';
      img.style.marginBottom = '20px';
      canvas.parentElement?.appendChild(img);
      canvas.style.display = 'none';
    });

    setTimeout(() => {
      window.print();

      // Restaurar canvas después de imprimir
      canvases.forEach((canvas) => {
        canvas.style.display = 'block';
        const imgs = canvas.parentElement?.querySelectorAll('img');
        imgs?.forEach((img) => img.remove());
      });
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.websocketService.close();
  }
}
