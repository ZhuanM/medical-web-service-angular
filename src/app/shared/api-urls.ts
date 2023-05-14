import { environment } from 'src/environments/environment';

export const apiUrls = {
  // Authentication
  loginUrl: environment.apiBaseUrl + 'authenticate',
  registerUrl: environment.apiBaseUrl + 'api/user/register',
  // Users
  // usersUrl: environment.apiBaseUrl + 'api/user', // ROOT
  // getAllUsersUrl: environment.apiBaseUrl + 'api/user/all', // ROOT
  // Patient
  patientUrl: environment.apiBaseUrl + 'patient', // ROOT
  getPatientByIdUrl: environment.apiBaseUrl + 'patient', // /{patientId} (GET)
  // Doctor
  doctorUrl: environment.apiBaseUrl + 'doctor', // ROOT
  getDoctorByIdUrl: environment.apiBaseUrl + 'doctor', // /{doctorId} (GET)
  // Specializations
  getSpecializationsUrl: environment.apiBaseUrl + 'doctor/specialities',
}
