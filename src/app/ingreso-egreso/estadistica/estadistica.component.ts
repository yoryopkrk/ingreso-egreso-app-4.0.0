import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import type { ChartConfiguration, ChartType } from 'chart.js';

import { IngresoEgreso } from '../ingreso-egreso.model';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';
import { selectIngresoEgresoItems } from '../ingreso-egreso.selectors';

@Component({
  selector: 'app-estadistica',
  standalone: false,
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos = 0;
  egresos = 0;

  cuantosIngresos = 0;
  cuantosEgresos = 0;

  subscription: Subscription = new Subscription();

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  };

  constructor(private readonly store: Store<fromIngresoEgreso.AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select(selectIngresoEgresoItems)
      .subscribe((items) => {
        this.contarIngresoEgreso(items);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  contarIngresoEgreso(items: IngresoEgreso[]): void {
    this.ingresos = 0;
    this.egresos = 0;

    this.cuantosEgresos = 0;
    this.cuantosIngresos = 0;

    items.forEach((item) => {
      if (item.tipo === 'ingreso') {
        this.cuantosIngresos++;
        this.ingresos += Number(item.monto);
        return;
      }

      this.cuantosEgresos++;
      this.egresos += Number(item.monto);
    });

    this.doughnutChartData = {
      labels: ['Ingresos', 'Egresos'],
      datasets: [
        {
          data: [this.ingresos, this.egresos],
        },
      ],
    };
  }
}
