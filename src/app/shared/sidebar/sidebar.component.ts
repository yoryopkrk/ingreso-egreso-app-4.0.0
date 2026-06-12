import { Component, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AuthService } from "../../auth/auth.service";
import { AppState } from "../../app.reducer";
import { IngresoEgresoService } from "../../ingreso-egreso/ingreso-egreso.service";
import { selectAuthUserName } from "../../../app/auth/auth.selectors";

@Component({
  selector: "app-sidebar",
  standalone: false,
  templateUrl: "./sidebar.component.html",
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre: string;
  subscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select(selectAuthUserName)
      .subscribe((nombre: string) => {
        this.nombre = nombre;
      });
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
