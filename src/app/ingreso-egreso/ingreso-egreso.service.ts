import { Injectable } from "@angular/core";
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import type { DocumentData, DocumentReference } from "@angular/fire/firestore";

import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { IngresoEgreso } from "./ingreso-egreso.model";
import { AuthService } from "../auth/auth.service";
import { AppState } from "../app.reducer";
import { SetItemsAction, UnsetItemsAction } from "./ingreso-egreso.actions";
import type { User } from "../auth/user.model";

@Injectable({
  providedIn: "root",
})
export class IngresoEgresoService {
  private ingresoEgresoListerSubcription: Subscription = new Subscription();
  private ingresoEgresoItemsSubcription: Subscription = new Subscription();

  constructor(
    private readonly firestore: Firestore,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
  ) {}

  initIngresoEgresoListener(): void {
    this.ingresoEgresoListerSubcription.unsubscribe();

    this.ingresoEgresoListerSubcription = this.store
      .select("auth")
      .subscribe((auth) => {
        this.ingresoEgresoItemsSubcription.unsubscribe();

        if (!auth.user?.uid) {
          this.store.dispatch(new UnsetItemsAction());
          return;
        }

        this.ingresoEgresoItems(auth.user);
      });
  }

  private ingresoEgresoItems(user: User): void {
    const itemsCollection = collection(
      this.firestore,
      `usuarios/${user.uid}/ingresos-egresos`,
    );

    this.ingresoEgresoItemsSubcription = collectionData(itemsCollection, {
      idField: "id",
    }).subscribe((coleccion: DocumentData[]) => {
      const items = coleccion.map(
        (item: DocumentData) => new IngresoEgreso(item),
      );

      this.store.dispatch(new SetItemsAction(items));
    });
  }

  cancelarSubscriptions(): void {
    this.ingresoEgresoListerSubcription.unsubscribe();
    this.ingresoEgresoItemsSubcription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso(
    ingresoEgreso: IngresoEgreso,
  ): Promise<DocumentReference<DocumentData>> {
    const user = this.getUserOrThrow();

    const itemsCollection = collection(
      this.firestore,
      `usuarios/${user.uid}/ingresos-egresos`,
    );

    const { id, ...data } = ingresoEgreso;

    return addDoc(itemsCollection, data);
  }

  borrarIngresoEgreso(id: string): Promise<void> {
    const user = this.getUserOrThrow();

    const itemDoc = doc(
      this.firestore,
      `usuarios/${user.uid}/ingresos-egresos/${id}`,
    );

    return deleteDoc(itemDoc);
  }

  private getUserOrThrow(): User {
    const user = this.authService.getUsuario();

    if (!user?.uid) {
      throw new Error("No hay un usuario autenticado.");
    }

    return user;
  }
}
