import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState as RootAppState } from '../app.reducer';

export interface IngresoEgresoState {
  items: IngresoEgreso[];
}

export interface AppState extends RootAppState {
  ingresoEgreso: IngresoEgresoState;
}

const estadoInicial: IngresoEgresoState = {
  items: [],
};

export function ingresoEgresoReducer(
  state = estadoInicial,
  action: fromIngresoEgreso.acciones,
): IngresoEgresoState {
  switch (action.type) {
    case fromIngresoEgreso.SET_ITEMS:
      return {
        items: action.items.map((item) => ({ ...item })),
      };

    case fromIngresoEgreso.UNSET_ITEMS:
      return {
        items: [],
      };

    default:
      return state;
  }
}
