import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonImg, IonThumbnail, IonItem, IonIcon, IonPopover, IonContent, IonList, IonLabel } from '@ionic/angular/standalone';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { SessionService } from 'src/app/service/session-service';
import { MenuModalComponent } from '../../elems/menu-modal/menu-modal.component';
import { LogoutModalComponent } from '../../elems/logout-modal/logout-modal.component';

@Component({
  selector: 'app-header',
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonImg, IonThumbnail, IonItem, IonIcon, IonPopover, IonContent, IonList, IonLabel, RouterModule, MenuModalComponent, LogoutModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  private _sessionService: SessionService = inject(SessionService);
  private _router: Router = inject(Router);
  
  private _isMenuOpened: WritableSignal<boolean> = signal(false);
  private _route: WritableSignal<string> = signal("");

  public readonly HOME_ROUTE: string = "/home";
  public readonly ABOUT_ROUTE: string = "/about";

  public year: Signal<number> = signal(new Date().getFullYear()).asReadonly();
  public isSessionStarted: Signal<boolean> = this._sessionService.isSessionStarted;
  public isMenuOpened: Signal<boolean> = computed(() => {return this._isMenuOpened();});
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
  ngOnInit() {}

  public requestMenuModal(): void {
    console.log("REQUEST!!")
    this._isMenuOpened.update((curval: boolean) => {
      console.log("curval", curval);
      return !curval;
    });
    console.log(this.isMenuOpened());
  }

  public requestLogoutModal(): void {
    this._sessionService.setLogoutRequest();
  }
}

