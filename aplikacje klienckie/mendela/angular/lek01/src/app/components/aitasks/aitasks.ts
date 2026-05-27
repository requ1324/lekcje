import { Component } from '@angular/core';

@Component({
  selector: 'app-aitasks',
  imports: [],
  templateUrl: './aitasks.html',
  styleUrl: './aitasks.css',
})
export class AItasks {
  photoUrl =
    'https://images.unsplash.com/photo-1778494183140-88a65a109564?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  photoWidth = 200;
  lightColor = 'red';
  isLocked = false;
  changeColor() {
    this.lightColor = 'blue';
  }
  statusText = '';
  mouseover() {
    this.statusText = 'Widzisz zdjecie';
  }
  mouseout() {
    this.statusText = 'Myszka uciekla';
  }
  inputText = '';
  input(e: Event) {
    const target = e.target as HTMLInputElement;
    this.inputText = target.value;
  }
  mirror = '';
  imgWidth = 200;
  inputVal = '';
  pasekWidth = 0;
  setWidth() {
    this.pasekWidth = parseInt(this.inputVal);
  }
}
