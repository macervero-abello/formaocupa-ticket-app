import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { IonModal, IonList, IonLabel, IonIcon, IonItem } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from 'src/app/service/session-service';
import { MenuService } from 'src/app/service/menu-service';

@Component({
  selector: 'app-menu-modal',
  imports: [IonModal, IonList, IonLabel, IonIcon, IonItem, RouterModule],
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  private _sessionService: SessionService = inject(SessionService);
  private _menuService: MenuService = inject(MenuService);
  private _router: Router = inject(Router);

  public readonly HOME_ROUTE: string = "/home";
  public readonly ABOUT_ROUTE: string = "/about";

  public route: Signal<string> = this._menuService.route;
  public isMenuModalOpen: Signal<boolean> = this._menuService.menuRequested;

  constructor() {}

  ngOnInit() {}

  public requestLogoutModal(): void {
    this._sessionService.setLogoutRequest();
  }

  public requestMenuModal(): void {
    this._menuService.setMenuRequest();
  }

  public goToAbout(): void {
    this._router.navigate(["/about"]);
  }

  public goToHome(): void {
    this._router.navigate(["/home"]);
  }
}

