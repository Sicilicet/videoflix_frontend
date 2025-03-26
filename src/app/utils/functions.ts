import { HttpHeaders } from '@angular/common/http';

/**
 * This function creates the header for the HTTP response by getting the authentication token from the local storage.
 * @returns HTTPHeaders
 */
export function getAuthHeaders(): HttpHeaders {
  return new HttpHeaders().set(
    'Authorization',
    `Token ${localStorage.getItem('token')}`
  );
}

/**
 * Generates an HttpHeaders object with the CSRF token.
 * @returns HttpHeaders with Content-Type and X-CSRFToken set.
 */
export function getCSRFHeader(): HttpHeaders {
  return new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-CSRFToken', getCSRFToken() || '');
}

/**
 * Retrieves the CSRF token from cookies.
 * @returns The CSRF token or null if not found.
 */
export function getCSRFToken(): string | null {
  let csrfToken = null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'csrftoken') {
      csrfToken = value;
      break;
    }
  }
  return csrfToken;
}
