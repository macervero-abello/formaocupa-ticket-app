import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonImg, IonThumbnail, IonItem, IonIcon } from '@ionic/angular/standalone';
import { SessionService } from 'src/app/service/session-service';

@Component({
  selector: 'app-header',
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonImg, IonThumbnail, IonItem, IonIcon],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  private _sessionService: SessionService = inject(SessionService);

  public year: Signal<number> = signal(new Date().getFullYear()).asReadonly();
  public isSessionStarted: Signal<boolean> = this._sessionService.isSessionStarted;
  
  constructor() {}
  ngOnInit() {}

  public requestLogoutModal(): void {
    this._sessionService.setLogoutRequest();
  }
}
