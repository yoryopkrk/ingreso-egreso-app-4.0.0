import { Component, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AppState } from "../../app.reducer";
import { selectAuthUserName } from "../../../app/auth/auth.selectors";

@Component({
  selector: "app-navbar",
  standalone: false,
  templateUrl: "./navbar.component.html",
  styles: [],
})
export class NavbarComponent implements OnInit, OnDestroy {
  nombre: string;
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select(selectAuthUserName)
      .subscribe((nombre: string) => {
        this.nombre = nombre;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
