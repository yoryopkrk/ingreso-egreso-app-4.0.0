import { Injectable } from '@angular/core';

import {
  Auth,
  User as FirebaseUser,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from '../shared/ui.accions';

import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AppState } from '../app.reducer';
import { SetUserAction, UnsetUserAction } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();
  private usuario: User | null = null;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly firestore: Firestore,
    private readonly store: Store<AppState>,
  ) {}

  initAuthListener(): void {
    this.authSubscription = authState(this.auth).subscribe((fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const usuarioDoc = doc(this.firestore, `${fbUser.uid}/usuario`);

        this.userSubscription = docData(usuarioDoc).subscribe((usuarioObj: any) => {
          const newUser = new User(usuarioObj);
          this.store.dispatch(new SetUserAction(newUser));
          this.usuario = newUser;
        });

        return;
      }

      this.usuario = null;
      this.userSubscription.unsubscribe();
      this.store.dispatch(new UnsetUserAction());
    });
  }

  crearUsuario(nombre: string, email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((resp) => {
        if (!resp.user) {
          throw new Error('No se pudo obtener el usuario creado.');
        }

        const user: User = {
          uid: resp.user.uid,
          nombre,
          email: resp.user.email ?? email,
        };

        return setDoc(doc(this.firestore, `${user.uid}/usuario`), { ...user });
      })
      .then(() => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch((error: unknown) => {
        console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());

        const message = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error en el registro', message, 'error');
      });
  }

  login(email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch((error: unknown) => {
        console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());

        const message = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error en el login', message, 'error');
      });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        this.usuario = null;
        this.store.dispatch(new UnsetUserAction());
        this.router.navigate(['/login']);
      })
      .catch((error: unknown) => {
        console.error(error);

        const message = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error al cerrar sesión', message, 'error');
      });
  }

  isAuth(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((fbUser: FirebaseUser | null) => {
        if (fbUser === null) {
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      }),
    );
  }

  getUsuario(): User | null {
    return this.usuario ? ({ ...this.usuario } as User) : null;
  }
}
