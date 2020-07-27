import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../_models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.baseUrl + 'users')
      .pipe(catchError(this.handleError));
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(this.baseUrl + `users/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.log(error);
    const applicationError = error?.headers?.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }
    if (error.status === 401) {
      return throwError('Your token has expired.');
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
