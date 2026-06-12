import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from "ng2-charts";

import { StoreModule } from "@ngrx/store";

import { DashboardComponent } from "../dashboard/dashboard.component";
import { IngresoEgresoComponent } from "./ingreso-egreso.component";
import { EstadisticaComponent } from "./estadistica/estadistica.component";
import { DetalleComponent } from "./detalle/detalle.component";
import { OrdenIngresoEgresoPipe } from "./orden-ingreso-egreso.pipe";

import { SharedModule } from "../shared/shared.module";
import { DashboardRoutingModule } from "../dashboard/dashboard-routing.module";
import { ingresoEgresoReducer } from "./ingreso-egreso.reducer";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,
    SharedModule,
    DashboardRoutingModule,
    StoreModule.forFeature("ingresoEgreso", ingresoEgresoReducer),
  ],
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoEgresoPipe,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class IngresoEgresoModule {}
