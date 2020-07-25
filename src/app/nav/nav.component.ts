import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  model: any = {};
  get loggedIn(): boolean {
    return this.authService.loggedIn;
  }

  get userName(): string {
    return this.authService.decodedToken?.unique_name;
  }

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.model).subscribe(
      (data) => this.alertify.success('Logged in successfully'),
      (error) => this.alertify.error('Login failed'),
      () => this.router.navigate(['/members'])
    );
  }

  logout(): void {
    this.authService.logout();
    this.alertify.success('Logged out');
    this.router.navigate(['/home']);
  }
}
