import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProductCardComponent, Product } from './product-card.component';
import { selectIsInWishlist } from '../../state/wishlist/wishlist.selectors';
import * as WishlistActions from '../../state/wishlist/wishlist.actions';
import { StockStatus } from '../../services/stock.utils';

/**
 * Unit tests for ProductCardComponent
 * Tests rendering of product info and user interactions (wishlist/add-to-cart)
 */
describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let store: MockStore;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    created_at: '2025-01-15T10:00:00Z',
    avgRating: 4.5,
    image: 'test-image.jpg',
    stock: 10,
    lowStockThreshold: 5,
  };

  const initialState = {
    wishlist: { items: [] },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [{ selector: selectIsInWishlist(1), value: false }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    // Set required inputs
    component.id = mockProduct.id!;
    component.name = mockProduct.name;
    component.price = mockProduct.price;
    component.created_at = mockProduct.created_at;
    component.avgRating = mockProduct.avgRating;
    component.image = mockProduct.image;
    component.stock = mockProduct.stock!;
    component.lowStockThreshold = mockProduct.lowStockThreshold!;

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize isInWishlist$ observable on init', () => {
      expect(component.isInWishlist$).toBeDefined();
    });
  });

  describe('Product Info Rendering', () => {
    it('should display product name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h3')?.textContent).toContain('Test Product');
    });

    it('should display product price', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('$99.99');
    });

    it('should display product rating', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('4.5/5');
    });

    it('should display formatted date', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // Date is formatted with Angular's date pipe
      expect(compiled.querySelector('p.text-sm')?.textContent).toBeDefined();
    });
  });

  describe('Stock Status Display', () => {
    it('should show "In Stock" for products with adequate stock', () => {
      component.stock = 10;
      component.lowStockThreshold = 5;
      fixture.detectChanges();

      const stockStatus = component.getStockStatus(component.stock, component.lowStockThreshold);
      expect(stockStatus.status).toBe(StockStatus.IN_STOCK);
    });

    it('should show "Low Stock" when stock is at or below threshold', () => {
      component.stock = 3;
      component.lowStockThreshold = 5;
      fixture.detectChanges();

      const stockStatus = component.getStockStatus(component.stock, component.lowStockThreshold);
      expect(stockStatus.status).toBe(StockStatus.LOW_STOCK);
    });

    it('should show "Out of Stock" when stock is 0', () => {
      component.stock = 0;
      component.lowStockThreshold = 5;
      fixture.detectChanges();

      const stockStatus = component.getStockStatus(component.stock, component.lowStockThreshold);
      expect(stockStatus.status).toBe(StockStatus.OUT_OF_STOCK);
    });

    it('should display stock status badge in template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const stockBadge = compiled.querySelector('.inline-flex');
      expect(stockBadge).toBeTruthy();
    });
  });

  describe('Wishlist Button', () => {
    it('should have wishlist button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const wishlistButton = compiled.querySelector('button[mat-icon-button]');
      expect(wishlistButton).toBeTruthy();
    });

    it('should show empty heart icon when not in wishlist', () => {
      store.overrideSelector(selectIsInWishlist(1), false);
      store.refreshState();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const iconText = compiled.querySelector('mat-icon')?.textContent?.trim();
      expect(iconText).toBe('favorite_border');
    });

    it('should show filled heart icon when in wishlist', async () => {
      // Set actual state with product in wishlist
      store.setState({
        wishlist: {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 99.99,
              image: 'test-image.jpg',
              stock: 10,
              lowStockThreshold: 5,
            },
          ],
        },
      });
      // Re-init the component to pick up new state
      component.ngOnInit();
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const iconText = compiled.querySelector('mat-icon')?.textContent?.trim();
      expect(iconText).toBe('favorite');
    });

    it('should have correct aria-label for accessibility', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[mat-icon-button]');
      const ariaLabel = button?.getAttribute('aria-label');
      expect(ariaLabel).toContain('Test Product');
    });
  });

  describe('Wishlist Toggle Interaction', () => {
    it('should dispatch addToWishlist when clicking on product not in wishlist', () => {
      store.overrideSelector(selectIsInWishlist(1), false);
      store.refreshState();
      fixture.detectChanges();

      const dispatchSpy = spyOn(store, 'dispatch');

      component.toggleWishlist();

      expect(dispatchSpy).toHaveBeenCalledWith(
        WishlistActions.addToWishlist({
          product: {
            id: mockProduct.id!,
            name: mockProduct.name,
            price: mockProduct.price,
            image: mockProduct.image || '',
            stock: mockProduct.stock!,
            lowStockThreshold: mockProduct.lowStockThreshold!,
          },
        }),
      );
    });

    it('should dispatch removeFromWishlist when clicking on product in wishlist', async () => {
      // Set actual state with product in wishlist
      store.setState({
        wishlist: {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 99.99,
              image: 'test-image.jpg',
              stock: 10,
              lowStockThreshold: 5,
            },
          ],
        },
      });
      // Re-init the component to pick up new state
      component.ngOnInit();
      fixture.detectChanges();
      await fixture.whenStable();

      const dispatchSpy = spyOn(store, 'dispatch');

      component.toggleWishlist();

      expect(dispatchSpy).toHaveBeenCalledWith(
        WishlistActions.removeFromWishlist({ productId: mockProduct.id! }),
      );
    });

    it('should toggle wishlist on button click', () => {
      store.overrideSelector(selectIsInWishlist(1), false);
      store.refreshState();
      fixture.detectChanges();

      const dispatchSpy = spyOn(store, 'dispatch');
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[mat-icon-button]') as HTMLButtonElement;

      button.click();
      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('Product Data Binding', () => {
    it('should update when input values change', () => {
      component.name = 'Updated Product Name';
      component.price = 149.99;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h3')?.textContent).toContain('Updated Product Name');
      expect(compiled.textContent).toContain('$149.99');
    });

    it('should handle missing optional image', () => {
      component.image = undefined;
      fixture.detectChanges();

      // Component should still render without errors
      expect(component).toBeTruthy();
    });

    it('should handle zero stock correctly', () => {
      component.stock = 0;
      fixture.detectChanges();

      const stockStatus = component.getStockStatus(0, component.lowStockThreshold);
      expect(stockStatus.status).toBe(StockStatus.OUT_OF_STOCK);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long product names', () => {
      component.name =
        'This is a very long product name that should be truncated or handled gracefully by the component';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h3')).toBeTruthy();
    });

    it('should handle decimal prices correctly', () => {
      component.price = 1234.56;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('$1234.56');
    });

    it('should handle rating of 0', () => {
      component.avgRating = 0;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('0/5');
    });

    it('should handle maximum rating of 5', () => {
      component.avgRating = 5;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('5/5');
    });
  });
});
