import { Component, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";
import { AppState } from "../../app.reducer";
import { selectIsLoading } from "../../../app/shared/ui.selectors";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
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
    this.authService.login(data.email, data.password);
  }
}
