import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  userToken: string = null;
  decodedToken: any;

  get loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

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
            this.decodedToken = this.jwtHelper.decodeToken();
            console.log(this.decodedToken);
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
    console.log(error);
    const applicationError = error?.headers?.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }
    if (error.status === 401) {
      return throwError('Incorrect email or password.');
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
