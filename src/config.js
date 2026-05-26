const isLocalhost = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost 
  ? 'http://localhost/Car-Rental-Website'
  : 'https://mltcarrental.online';

export const API_BASE_URL_ADMIN = isLocalhost 
  ? 'http://localhost/mlt-admin/back'
  : 'https://mlt-admin.mltcarrental.online/back';