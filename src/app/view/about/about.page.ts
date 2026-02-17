import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonIcon, IonImg } from '@ionic/angular/standalone';
import { HeaderComponent } from '../layout/header/header.component';
import { LogoutModalComponent } from '../elems/logout-modal/logout-modal.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonIcon, IonImg, CommonModule, FormsModule, LogoutModalComponent]
})
export class AboutPage implements OnInit {

  constructor() {}

  ngOnInit() {}

}
