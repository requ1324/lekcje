import { DatePipe, isPlatformBrowser, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

registerLocaleData(localePl);

@Component({
  selector: 'app-xml',
  imports: [DatePipe],
  templateUrl: './xml.html',
  styleUrl: './xml.css',
})
export class Xml {
  date$: Observable<Date>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.date$ = interval(1000).pipe(
        startWith(0),
        map(() => new Date()),
      );
    } else {
      this.date$ = of(new Date());
    }
  }
}
