import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private _inputData: BehaviorSubject<string> = new BehaviorSubject('');
  public inputData: Observable<string> = this._inputData.asObservable();

  constructor() {}

  /**
   * This function sets the data the user writes into the field on the landing page and provides it as an observable. It is needed on the login page.
   * @param data string
   */
  setInputData(data: string) {
    this._inputData.next(data);
  }
}