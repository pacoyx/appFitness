import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.store.select('ui').subscribe(estado => {
      this.isLoading = estado.isLoading;
    });

    // this.loadingSubs = this.uiService.loadindStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });

    this.loginForm = new FormGroup({
      email: new FormControl('test@test.com', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('123456', { validators: [Validators.required] })
    });

  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
}
