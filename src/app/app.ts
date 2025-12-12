import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './components/header.component';
import { appInit } from './state/app.actions';
import { restoreAuthFromStorage } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('my-shop');
  private readonly store = inject(Store);

  ngOnInit() {
    this.store.dispatch(restoreAuthFromStorage());
    this.store.dispatch(appInit());
  }
}
