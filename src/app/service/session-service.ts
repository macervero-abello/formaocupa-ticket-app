import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _http: HttpClient = inject(HttpClient);

  private readonly BASE_URL = "https://formaocupa.capalabs.com";
  private readonly LSTAG = "FIRAFP_SESSION_DATA";

  private _user: WritableSignal<User|null> = signal(null);
  public user: Signal<User|null> = computed(() => {
    return this._user();
  });

  private _isSessionStarted: WritableSignal<boolean> = signal(false);
  public isSessionStarted: Signal<boolean> = computed(() => {
    return this._isSessionStarted();
  });

  private _logoutRequested: WritableSignal<boolean> = signal(false);
  public logoutRequested: Signal<boolean> = computed(() => {
    return this._logoutRequested();
  });

  public async login(user: string, passwd: string): Promise<boolean> {
    const data: any = {
      "username": user,
      "password": passwd
    };

    const response: any = await firstValueFrom(this._http.post<User>(this.BASE_URL + "/api/login", data));
    
    return new Promise((resolve) => {
      if(response.status == 200) {
        this._user.set({
          token: response.token,
          id: response.user.id,
          username: response.user.username,
          family: response.user.stand_description,
          stand: response.user.stand,
          nvisits: 0,
          barcodes: []
        });

        localStorage.setItem(this.LSTAG, JSON.stringify(this._user()));
        this._isSessionStarted.set(true);
        resolve(true);
      } else {
        this._user.set(null);

        localStorage.removeItem(this.LSTAG);
        this._isSessionStarted.set(false);
        resolve(false);
      }
    });
  }

  public async logout(): Promise<void> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + this._user()?.token
    });

    await firstValueFrom(this._http.get(this.BASE_URL + "/api/logout", {'headers': headers})).catch((error: any) => {}).finally(() => {
      this._user.set(null);
      localStorage.removeItem(this.LSTAG);
      this._isSessionStarted.set(false);
    });

    /*this._http.get("/api/logout", {'headers': headers}).subscribe({
      next: (response: any) => {
        this._user = null;
        console.log("LOGOUT ", this._isSessionStarted());
        this._isSessionStarted.set(false);
        console.log("LOGOUT ", this._isSessionStarted());
      },
      error: (error: any) => {
        console.log(error);
      }
    });*/
  }

  public checkSession(): void {
    let tmp = localStorage.getItem(this.LSTAG);
    if(!this._isSessionStarted() && tmp != null) {
      this._user.set(JSON.parse(tmp));
      this._isSessionStarted.set(true);
    }
  }

  public updateUserData(nvisits: number, barcodes: string[]) {
    this._user.update((curuser: User|null) => {
      if(curuser != null) {
        curuser.nvisits = nvisits;
        curuser.barcodes = barcodes;
        localStorage.setItem(this.LSTAG, JSON.stringify(curuser));
      }
      return curuser;
    });
  }

  public setLogoutRequest(): void {
    this._logoutRequested.update((curval: boolean) => {
      return !curval;
    });
  }
}
