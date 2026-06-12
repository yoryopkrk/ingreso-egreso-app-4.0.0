import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';

import * as fromIngresoEgreso from '../ingreso-egreso.reducer';
import { selectIngresoEgresoItems } from '../ingreso-egreso.selectors';

@Component({
  selector: 'app-detalle',
  standalone: false,
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store<fromIngresoEgreso.AppState>,
    public readonly ingresoEgresoService: IngresoEgresoService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select(selectIngresoEgresoItems)
      .subscribe((items) => {
        this.items = items;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  borrarItem(item: IngresoEgreso): void {
    if (!item.id) {
      Swal.fire('Error', 'No se encontró el ID del registro.', 'error');
      return;
    }

    this.ingresoEgresoService.borrarIngresoEgreso(item.id)
      .then(() => {
        Swal.fire('Eliminado', item.descripcion, 'success');
      })
      .catch((error: unknown) => {
        console.error(error);

        const message = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error al eliminar', message, 'error');
      });
  }
}
