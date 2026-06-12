import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user,
);

export const selectAuthUserName = createSelector(
  selectAuthUser,
  (user) => user?.nombre ?? '',
);

export const selectIsAuthenticated = createSelector(
  selectAuthUser,
  (user) => !!user?.uid,
);
