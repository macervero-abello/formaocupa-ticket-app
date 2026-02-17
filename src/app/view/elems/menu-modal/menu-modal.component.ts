import { Component, computed, inject, input, InputSignal, OnInit, output, OutputEmitterRef, signal, Signal, WritableSignal } from '@angular/core';
import { IonModal, IonContent, IonList, IonLabel, IonIcon, IonItem, IonGrid, IonRow, IonCol, IonTitle, IonButton } from '@ionic/angular/standalone';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SessionService } from 'src/app/service/session-service';
import { startWith, filter, map, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-menu-modal',
  imports: [IonModal, IonContent, IonList, IonLabel, IonIcon, IonItem, IonGrid, IonRow, IonCol, IonTitle, IonButton, RouterModule],
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  private _sessionService: SessionService = inject(SessionService);
  private _router: Router = inject(Router);

  private _route: WritableSignal<string> = signal("");

  public readonly HOME_ROUTE: string = "/home";
  public readonly ABOUT_ROUTE: string = "/about";

  public isMenuModalOpen: InputSignal<boolean> = input.required<boolean>();
  public closeMenu: OutputEmitterRef<void> = output();
  
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

  public requestLogoutModal(): void {
    this.closeMenu.emit();
    this._sessionService.setLogoutRequest();
  }

  public goToAbout(): void {
    console.log("GOTO");
    this.closeMenu.emit();
    this._router.navigate(["/about"]);
  }

  public goToHome(): void {
    console.log("GOTO");

    this.closeMenu.emit();
    this._router.navigate(["/home"]);
  }
}

