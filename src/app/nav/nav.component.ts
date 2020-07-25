import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  get loggedIn(): boolean {
    return this.authService.loggedIn;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.model).subscribe(
      (data) => console.log(data),
      (error) => {
        console.log('CAUGHT');
        console.log(error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
