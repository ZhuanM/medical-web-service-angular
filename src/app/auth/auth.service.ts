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

  register(
    name: string,
    username: string,
    password: string,
    role: string,
    uniqueUserNumber: string,
    specialization: string,
    gp: {
      userId: string
    }
    ) {
    if (role === 'PATIENT') {
      return this.http.post<any>(
        apiUrls.patientUrl,
        {
          "name": name,
          "username": username,
          "password": password,
          "ucn": uniqueUserNumber,
          "gp": {
            "userId": gp?.userId
          }
        }
      )
    } else if (role === 'DOCTOR') {
      return this.http.post<any>(
        apiUrls.doctorUrl,
        {
          "name": name,
          "username": username,
          "password": password,
          "npi": uniqueUserNumber,
          "specialty": specialization
        }
      )
    } else {
      return;
    }
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
}
