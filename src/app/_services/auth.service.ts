import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  userToken: string = null;

  get loggedIn(): boolean {
    return this.userToken !== null;
  }

  constructor(private http: HttpClient) {}

  login(model: any): Observable<{ token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, model, {
        headers,
      })
      .pipe(
        tap((res) => {
          if (res.token) {
            this.userToken = res.token;
            localStorage.setItem('token', res.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.userToken = null;
    localStorage.removeItem('token');
  }

  register(model: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${this.baseUrl}/register`, model, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const applicationError = error?.headers?.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }
    let modelStateErrors = [];
    if (error?.error?.errors) {
      Object.values(error.error.errors).forEach((e: string[]) =>
        modelStateErrors.push(...e)
      );
    }
    return throwError(modelStateErrors.join('\n') || 'Server error');
  }
}
