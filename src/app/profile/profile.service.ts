import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getPatientById(id: string) {
    return this.http.get<any>(
      apiUrls.getPatientByIdUrl + '/' + id.toString() + ''
    )
  }

  getDoctorById(id: string) {
    return this.http.get<any>(
      apiUrls.getDoctorByIdUrl + '/' + id.toString() + ''
    )
  }

  getDoctorVisits(id: string) {
    let params = new HttpParams();
    params = params.append('doctor.userId', id);

    return this.http.get<any>(
      apiUrls.visitsUrl,
      { params }
    )
  }

  getDoctorPatients(id: string) {
    let params = new HttpParams();
    params = params.append('gp.userId', id);

    return this.http.get<any>(
      apiUrls.patientUrl,
      { params }
    )
  }
}
