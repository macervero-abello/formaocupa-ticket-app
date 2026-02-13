import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { SessionService } from '../service/session-service';
import { inject, Signal } from '@angular/core';
import { BarcodeScannerService } from '../service/barcode-scanner-service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const sessionService: SessionService = inject(SessionService);
  const barcodeScannerService: BarcodeScannerService = inject(BarcodeScannerService);
  const router: Router = inject(Router);
  /*const isSessionStarted: Signal<boolean> = computed(() => {
    console.log("AUTH GUARD ", sessionService.isSessionStarted());
    return sessionService.isSessionStarted();
  });*/
  const isSessionStarted: Signal<boolean> = sessionService.isSessionStarted;
  sessionService.checkSession();

  if(isSessionStarted()) {
    let nvisits = sessionService.user()?.nvisits;
    let barcodes = sessionService.user()?.barcodes;

    if(nvisits == null) nvisits = 0;
    if(barcodes == null) barcodes = [];
    barcodeScannerService.loadSavedData(nvisits, barcodes);
  }

  if(route.url[0].path == "login") {
    if(isSessionStarted()) {
      router.navigate(["/home"]);
      return false;
    }
  } else {
    if(!isSessionStarted()) {
      router.navigate(["/login"])
      return false;
    }
  }
  return true;
};
