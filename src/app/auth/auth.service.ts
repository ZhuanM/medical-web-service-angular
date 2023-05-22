import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrls } from './../shared/api-urls';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient
  ) {}

  authHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  })

  login(username: string, password: string) {
    return this.http.post<any>(
      apiUrls.loginUrl,
      {
        "username": username,
        "password": password
      },
      { headers: this.authHeaders }
    )
  }

  registerPatient(
    name: string,
    username: string,
    password: string,
    uniqueCitizenNumber: string,
    gp: {
      userId: string,
      name: string
    }
    ) {
    return this.http.post<any>(
      apiUrls.patientUrl,
      {
        "name": name,
        "username": username,
        "password": password,
        "uniqueCitizenNumber": uniqueCitizenNumber,
        "gp": {
          "userId": gp?.userId,
          "name": gp?.name
        }
      }
    )
  }

  registerDoctor(
    name: string,
    username: string,
    password: string,
    uniqueDoctorNumber: string,
    specialization: string
  ) {
    return this.http.post<any>(
      apiUrls.doctorUrl,
      {
        "name": name,
        "username": username,
        "password": password,
        "uniqueDoctorNumber": uniqueDoctorNumber,
        "specialization": specialization
      }
    )
  }

  getUser(role: string, id: number) {
    if (role == "PATIENT") {
      return this.http.get<any>(
        apiUrls.getPatientByIdUrl + '/' + id.toString() + ''
      )
    } else if (role == "DOCTOR") {
      return this.http.get<any>(
        apiUrls.getDoctorByIdUrl + '/' + id.toString() + ''
      )
    }
  }

  getSpecializations() {
    return this.http.get<any>(
      apiUrls.getSpecializationsUrl
    )
  }

  getDoctors() {
    return this.http.get<any>(
      apiUrls.doctorUrl
    )
  }
}
