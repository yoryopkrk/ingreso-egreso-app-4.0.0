import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListerSubcription: Subscription = new Subscription();
  ingresoEgresoItemsSubcription: Subscription = new Subscription();


  constructor( private firestore: Firestore,
               public authService: AuthService,
               private store: Store<AppState>) { }



  initIngresoEgresoListener() {

    this.ingresoEgresoListerSubcription = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null )
        )
        .subscribe(auth =>
              this.ingresoEgresoItems(auth.user.uid)
            );

  }

  private ingresoEgresoItems( uid: string ) {

    const itemsCollection = collection(this.firestore, `${ uid }/ingresos-egresos/items`);

    this.ingresoEgresoItemsSubcription = collectionData(itemsCollection, { idField: 'uid' })
             .subscribe( (coleccion: any[]) => {

              this.store.dispatch( new SetItemsAction(coleccion) );

             });


  }

  cancelarSubscriptions() {
    this.ingresoEgresoListerSubcription.unsubscribe();
    this.ingresoEgresoItemsSubcription.unsubscribe();
    this.store.dispatch( new UnsetItemsAction() );
  }


  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const user = this.authService.getUsuario();

    return addDoc(collection(this.firestore, `${ user.uid }/ingresos-egresos/items`), {...ingresoEgreso});
  }

  borrarIngresoEgreso( uid: string ) {

    const user = this.authService.getUsuario();

    return deleteDoc(doc(this.firestore, `${ user.uid }/ingresos-egresos/items/${ uid }`));

  }


}
