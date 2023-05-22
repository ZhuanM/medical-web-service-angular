export function getAccessToken() {
  const sessionAccessToken = localStorage.getItem('access_token');

  if (sessionAccessToken) {
    return sessionAccessToken;
  }

  return null;
}

export function setUserLocalStorageData(userData: any) {
  localStorage.setItem('name', userData.name);
  localStorage.setItem('uniqueCitizenNumber', userData.uniqueCitizenNumber);
  localStorage.setItem('uniqueDoctorNumber', userData.uniqueDoctorNumber);
  localStorage.setItem('healthTaxesPaidUntil', userData.healthTaxesPaidUntil);
  localStorage.setItem('gp', userData.gp);
  localStorage.setItem('engagedParty', userData.engagedParty);
  localStorage.setItem('specializations', userData.specializations);
}

export function hasPaidHealthTaxesForLastSixMonths(healthTaxesPaidUntil: any): boolean {
  if (!healthTaxesPaidUntil) {
    return false;
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const healthTaxesPaidUntilDate = new Date(healthTaxesPaidUntil);

  return healthTaxesPaidUntilDate >= sixMonthsAgo;
}