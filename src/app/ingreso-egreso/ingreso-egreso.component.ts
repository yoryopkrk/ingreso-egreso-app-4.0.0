import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { IngresoEgreso } from "./ingreso-egreso.model";
import { IngresoEgresoService } from "./ingreso-egreso.service";
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from "../shared/ui.accions";

import * as fromIngresoEgreso from "../ingreso-egreso/ingreso-egreso.reducer";
import { selectIsLoading } from "../shared/ui.selectors";

@Component({
  selector: "app-ingreso-egreso",
  standalone: false,
  templateUrl: "./ingreso-egreso.component.html",
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  tipo = "ingreso";

  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor(
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<fromIngresoEgreso.AppState>,
  ) {}

  ngOnInit() {
    this.loadingSubs = this.store
      .select(selectIsLoading)
      .subscribe((isLoading: boolean) => {
        this.cargando = isLoading;
      });
    this.forma = new FormGroup({
      descripcion: new FormControl("", Validators.required),
      monto: new FormControl(0, Validators.min(0)),
    });
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction());

    const ingresoEgreso = new IngresoEgreso({
      ...this.forma.value,
      tipo: this.tipo,
    });

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire("Creado", ingresoEgreso.descripcion, "success");
      this.forma.reset({ monto: 0 });
    });
  }
}
