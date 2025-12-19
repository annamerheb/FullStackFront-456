import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideMockStore({
          initialState: {
            auth: { access: null, refresh: null, loading: false, error: null },
            cart: { items: [], totalPrice: 0, itemCount: 0 },
            wishlist: { items: [] },
            user: { user: null, loading: false, error: null, selectedOrder: null },
          },
        }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
