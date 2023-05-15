import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrls } from './../shared/api-urls';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private http: HttpClient
  ) {}

  updateHealthTaxDate(id: string, date: string) {
    return this.http.patch<any>(
      apiUrls.patientUrl + '/' + id,
      { healthTaxesPaidUntil: date }
    )
  }
}
