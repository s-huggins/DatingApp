import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  userToken: string = null;
  decodedToken: any;
  currentUser: User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl$ = this.photoUrl.asObservable();

  get loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  changeMemberPhoto(newPhotoUrl: string): void {
    this.photoUrl.next(newPhotoUrl);
    this.currentUser.photoUrl = newPhotoUrl;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  login(model: any): Observable<{ token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<{ token: string; user: any }>(`${this.baseUrl}/login`, model, {
        headers,
      })
      .pipe(
        tap((res) => {
          if (res.token) {
            this.userToken = res.token;
            localStorage.setItem('token', res.token);
            this.decodedToken = this.jwtHelper.decodeToken(); // AFTER setting token in local storage
            localStorage.setItem('user', JSON.stringify(res.user));
            this.currentUser = res.user;
            this.changeMemberPhoto(
              this.currentUser.photoUrl || '../../assets/user.png'
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.userToken = null;
    localStorage.removeItem('token');
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  register(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${this.baseUrl}/register`, user, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
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
