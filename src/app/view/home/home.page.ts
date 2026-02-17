import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonFab, IonFabButton, IonIcon, IonButton, IonList, IonItem, IonListHeader, IonLabel, IonTitle, IonModal, IonText } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { BarcodeScannerService } from 'src/app/service/barcode-scanner-service';
import { HeaderComponent } from '../layout/header/header.component';
import { SessionService } from 'src/app/service/session-service';
import { User } from 'src/app/model/user';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonFab, IonFabButton, IonIcon, IonButton, IonList, IonItem, IonListHeader, IonLabel, IonTitle, IonModal, IonText, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit {
  private _router: Router = inject(Router);
  private _barcodeScannerService: BarcodeScannerService = inject(BarcodeScannerService);
  private _sessionService: SessionService = inject(SessionService);
  
  public showVisits: WritableSignal<boolean> = signal(false);

  public lastBarcode: Signal<String> = this._barcodeScannerService.lastBarcode;
  public readBarcodes: Signal<String[]> = this._barcodeScannerService.readBarcodes;
  public user: Signal<User|null> = this._sessionService.user;
  public nvisits: Signal<number> = this._barcodeScannerService.nvisits;
  public sessionError: Signal<boolean> = this._barcodeScannerService.sessionError;
  public serverError: Signal<boolean> = this._barcodeScannerService.serverError;

  public isVisitModalOpen: WritableSignal<boolean> = signal(false);
  public isErrorModalOpen: WritableSignal<boolean> = signal(false);

  constructor() {}
  ngOnInit() {}

  public async onScanQR(): Promise<void> {
    await this._barcodeScannerService.scanQR();
    this.isVisitModalOpen.set(true);
  }

  public onShowVisits(): void {
    this.showVisits.update((currentVal: boolean) => {
      return !currentVal;
    });
  }

  public async onAddVisit(): Promise<void> {
    await this._barcodeScannerService.addVisit();

    this.isVisitModalOpen.set(false);
    this.isErrorModalOpen.set(false);

    if(this.sessionError() || this.serverError()) {
      this.isErrorModalOpen.set(true);
    } else {
      this.isErrorModalOpen.set(false);
      this.onScanQR();
    }
  }

  public onIgnoreVisit(): void {
    this.isVisitModalOpen.set(false);
    this.isErrorModalOpen.set(false);

    this.onScanQR();
  }

  public async onResetSession(): Promise<void> {
    this.isErrorModalOpen.set(false);
    await this._sessionService.logout();
    this._router.navigate(["/login"]);
  }
}
