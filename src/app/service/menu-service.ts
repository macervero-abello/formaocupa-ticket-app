import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { startWith, filter, map, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private _router: Router = inject(Router);
  
  private _menuRequested: WritableSignal<boolean> = signal(false);
  public menuRequested: Signal<boolean> = computed(() => {
    return this._menuRequested();
  });

  private _route: WritableSignal<string> = signal("");
  public route: Signal<string> = computed(() => {return this._route();});


  constructor() {
    this._router.events.pipe(
      startWith(this._router.url),
      filter((event) => typeof event === 'string' || event instanceof NavigationEnd),
      map(() => this._router.url),
      distinctUntilChanged()
    ).subscribe({
      next: (url) => {
        console.log("ROUTER EVENT!");
        console.log(url);
        this._route.set(url as string);
      },
      complete: () => {},
      error: (error) => {}
    });
  }

  public setMenuRequest(): void {
    this._menuRequested.update((curval: boolean) => {
      return !curval;
    });
  }
}
