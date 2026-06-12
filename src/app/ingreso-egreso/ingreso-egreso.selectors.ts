import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IngresoEgresoState } from './ingreso-egreso.reducer';

export const selectIngresoEgresoState =
  createFeatureSelector<IngresoEgresoState>('ingresoEgreso');

export const selectIngresoEgresoItems = createSelector(
  selectIngresoEgresoState,
  (state: IngresoEgresoState) => state.items,
);
