import { Component, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";
import { AppState } from "../../app.reducer";
import { selectIsLoading } from "../../../app/shared/ui.selectors";

@Component({
  selector: "app-register",
  standalone: false,
  templateUrl: "./register.component.html",
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select(selectIsLoading)
      .subscribe((isLoading: boolean) => {
        this.cargando = isLoading;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data: any) {
    this.authService.crearUsuario(data.nombre, data.email, data.password);
  }
}
