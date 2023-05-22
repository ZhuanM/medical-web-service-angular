import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrls } from './../shared/api-urls';

@Injectable({ providedIn: 'root' })
export class VisitsService {
  constructor(
    private http: HttpClient
  ) {}

  getPatientVisits(id: string) {
    let params = new HttpParams();
    params = params.append('patient.userId', id);

    return this.http.get<any>(
      apiUrls.visitsUrl,
      { params }
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

  updateVisit(id: string, params: any) {
    const payload = {
      diagnosis: params.diagnosis,
      medicaments: params.treatment,
      sickLeave: {
        startDate: params.sickLeaveFrom,
        endDate: params.sickLeaveTo,
        numberOfDays: params.numberOfDays
      },
    };

    return this.http.patch<any>(
      apiUrls.visitsUrl + '/' + id,
      payload
    )
  }

  createVisit(
    date: string,
    doctor: {name: string, userId: string},
    patient: {name: string, userId: string}
  ) {
    return this.http.post<any>(
      apiUrls.visitsUrl,
      {
        "date": date,
        "doctor": doctor,
        "patient": patient,
      }
    )
  }
}
