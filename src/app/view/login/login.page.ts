import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonRow, IonText } from '@ionic/angular/standalone';
import { SessionService } from 'src/app/service/session-service';
import { HeaderComponent } from 'src/app/view/layout/header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonRow, IonText, FormsModule, RouterModule],
})
export class LoginPage implements OnInit {
  private _sessionService: SessionService = inject(SessionService);
  private _router: Router = inject(Router);

  public uname: WritableSignal<string> = signal("");
  public passwd: WritableSignal<string> = signal("");
  public year: Signal<number> = signal(new Date().getFullYear()).asReadonly();

  public error: WritableSignal<boolean> = signal(false);

  constructor() {}
  ngOnInit() {}

  public onLogin() {
    this._sessionService.login(this.uname(), this.passwd()).then(
      (islogged: boolean) => {
        if(islogged) {
          this.error.set(false);
          this._router.navigate(["/home"]);
        } else {
          this.error.set(true);
        }
      }
    );
  }
}
