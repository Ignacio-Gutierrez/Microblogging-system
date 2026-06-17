import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private readonly titleSubject = new BehaviorSubject<string>('Microblogging');

  readonly title$: Observable<string> = this.titleSubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }
}