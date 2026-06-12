import { Injectable } from "@angular/core";

import {
  Auth,
  User as FirebaseUser,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@angular/fire/auth";

import { Firestore, doc, getDoc, setDoc } from "@angular/fire/firestore";

import { Router } from "@angular/router";

import { Store } from "@ngrx/store";
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from "../shared/ui.accions";

import { map } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";

import Swal from "sweetalert2";
import { User } from "./user.model";
import { AppState } from "../app.reducer";
import { SetUserAction, UnsetUserAction } from "./auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authSubscription: Subscription = new Subscription();
  private usuario: User | null = null;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly firestore: Firestore,
    private readonly store: Store<AppState>,
  ) {}

  initAuthListener(): void {
    this.authSubscription.unsubscribe();

    this.authSubscription = authState(this.auth).subscribe(
      (fbUser: FirebaseUser | null) => {
        if (!fbUser) {
          this.usuario = null;
          this.store.dispatch(new UnsetUserAction());
          return;
        }

        this.cargarUsuarioFirestore(fbUser).catch((error: unknown) => {
          console.error(error);

          this.usuario = null;
          this.store.dispatch(new UnsetUserAction());

          const message =
            error instanceof Error ? error.message : "Error desconocido";
          Swal.fire("Error cargando usuario", message, "error");
        });
      },
    );
  }

  crearUsuario(nombre: string, email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((resp) => {
        const user = new User({
          uid: resp.user.uid,
          nombre,
          email: resp.user.email ?? email,
        });

        return setDoc(doc(this.firestore, `usuarios/${user.uid}`), { ...user });
      })
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(["/"]);
      })
      .catch((error: unknown) => {
        console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());

        const message =
          error instanceof Error ? error.message : "Error desconocido";
        Swal.fire("Error en el registro", message, "error");
      });
  }

  login(email: string, password: string): void {
    this.store.dispatch(new ActivarLoadingAction());

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(["/"]);
      })
      .catch((error: unknown) => {
        console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());

        const message =
          error instanceof Error ? error.message : "Error desconocido";
        Swal.fire("Error en el login", message, "error");
      });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        this.usuario = null;
        this.store.dispatch(new UnsetUserAction());
        this.router.navigate(["/login"]);
      })
      .catch((error: unknown) => {
        console.error(error);

        const message =
          error instanceof Error ? error.message : "Error desconocido";
        Swal.fire("Error al cerrar sesión", message, "error");
      });
  }

  isAuth(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((fbUser: FirebaseUser | null) => {
        if (fbUser === null) {
          this.router.navigate(["/login"]);
          return false;
        }

        return true;
      }),
    );
  }

  getUsuario(): User | null {
    return this.usuario ? ({ ...this.usuario } as User) : null;
  }

  private async cargarUsuarioFirestore(fbUser: FirebaseUser): Promise<void> {
    const usuarioDocRef = doc(this.firestore, `usuarios/${fbUser.uid}`);
    const usuarioSnap = await getDoc(usuarioDocRef);

    if (usuarioSnap.exists()) {
      const usuario = new User({
        ...usuarioSnap.data(),
        uid: fbUser.uid,
        email: fbUser.email ?? "",
      });

      this.setUsuario(usuario);
      return;
    }

    const usuario = new User({
      uid: fbUser.uid,
      email: fbUser.email ?? "",
      nombre: fbUser.displayName ?? "",
    });

    await setDoc(usuarioDocRef, { ...usuario });

    this.setUsuario(usuario);
  }

  private setUsuario(usuario: User): void {
    if (!usuario.uid) {
      throw new Error("El usuario no tiene UID.");
    }

    this.usuario = usuario;
    this.store.dispatch(new SetUserAction(usuario));
  }
}
