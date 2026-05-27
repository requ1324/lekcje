import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AItasks } from './components/aitasks/aitasks';
import { Xml } from './components/xml/xml';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AItasks, Xml],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lek01');
}
