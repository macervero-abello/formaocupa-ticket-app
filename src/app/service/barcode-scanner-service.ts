import { computed, effect, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerScanResult, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { firstValueFrom } from 'rxjs';
import { SessionService } from './session-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private _sessionService: SessionService = inject(SessionService);
  private _http: HttpClient = inject(HttpClient);

  private readonly LSTAG = "FIRAFP_VISITANTS_DATA";

  private _lastBarcode: WritableSignal<string> = signal("");
  private _readBarcodes: WritableSignal<string[]> = signal([]);
  private _nvisits: WritableSignal<number> = signal(0);
  private _sessionError: WritableSignal<boolean> = signal(false);
  private _serverError: WritableSignal<boolean> = signal(false);

  public lastBarcode: Signal<string> = computed(() => {return this._lastBarcode();});
  public readBarcodes: Signal<string[]> = computed(() => {return this._readBarcodes();});
  public nvisits: Signal<number> = computed(() => {return this._nvisits();});
  public sessionError: Signal<boolean> = computed(() => {return this._sessionError();});
  public serverError: Signal<boolean> = computed(() => {return this._serverError();});

  constructor() {
    effect(() => {
      this._sessionService.updateUserData(this._nvisits(), this._readBarcodes());
    });
  }

  public loadSavedData(nvisits: number, barcodes: string[]): void {
    this._nvisits.set(nvisits);
    this._readBarcodes.set(barcodes);
  }

  public async scanQR(): Promise<void> {
    let options: CapacitorBarcodeScannerOptions = {
      scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
      scanButton: true,
      scanText: "Visites escanejades: " + this._nvisits()
    }

    let result: CapacitorBarcodeScannerScanResult = await CapacitorBarcodeScanner.scanBarcode(options);
    if(result) this._lastBarcode.set(result.ScanResult);
    else this._lastBarcode.set("");
  }

  public async addVisit(): Promise<void> {
    if(this._lastBarcode() == "") return;

    this._readBarcodes.update((currentVal: string[]) => {
      return [...currentVal, this._lastBarcode()];
    });
    this._nvisits.update((currentVal: number) => {
      return currentVal + 1;
    });

    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + this._sessionService.user()?.token
    });
    const data: any = {
      ticketnum: this._lastBarcode(),
      stand_id: this._sessionService.user()?.stand
    }

    this._sessionError.set(false);
    this._serverError.set(false);
    const response = await firstValueFrom(this._http.post("/api/visit", data, {'headers': headers})).catch((error: any) => {
      this.checkError(error);
    });
  }

  private async checkError(error: any) {
    if(error.status == 401 || error.stand == 404) {
      //Session expired
      this._sessionError.set(true);
    } else if(error.status == 500) {
      this._serverError.set(true);
    }
  }
}
