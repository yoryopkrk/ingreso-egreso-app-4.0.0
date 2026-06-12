import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State as UiState } from "./ui.reducer";

export const selectUiState = createFeatureSelector<UiState>("ui");

export const selectIsLoading = createSelector(
  selectUiState,
  (state: UiState) => state.isLoading,
);
