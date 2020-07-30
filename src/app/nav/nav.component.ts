import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  model: any = {};
  photoUrlSub: Subscription;
  photoUrl: string;
  get loggedIn(): boolean {
    return this.authService.loggedIn;
  }
  // get mainPhotoUrl(): string {
  //   console.log(this.authService.currentUser?.photoUrl);
  //   return this.authService.currentUser?.photoUrl;
  // }

  get userName(): string {
    return this.authService.decodedToken?.unique_name;
  }

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.photoUrlSub = this.authService.currentPhotoUrl$.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }

  ngOnDestroy(): void {
    this.photoUrlSub.unsubscribe();
  }

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
