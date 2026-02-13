import { Component, inject, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonGrid, IonRow, IonCol, IonTitle, IonLabel, IonModal, IonButton } from '@ionic/angular/standalone';
import { SessionService } from 'src/app/service/session-service';

@Component({
  selector: 'app-logout-modal',
  imports: [IonGrid, IonRow, IonCol, IonTitle, IonLabel, IonModal, IonButton],
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent  implements OnInit {
  private _sessionService: SessionService = inject(SessionService);
  private _router: Router = inject(Router);

  public isLogoutModalOpen: Signal<boolean> = this._sessionService.logoutRequested;
  
  constructor() {}
  ngOnInit() {}

  public async logout(): Promise<void> {
    await this._sessionService.logout();
    this._router.navigate(["/login"]);
  }

  public requestLogoutModal(): void {
    this._sessionService.setLogoutRequest();
  }
}
