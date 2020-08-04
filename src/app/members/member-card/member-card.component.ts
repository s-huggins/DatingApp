import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { faUser, faHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  faUser = faUser;
  faHeart = faHeart;
  faEnvelope = faEnvelope;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {}

  sendLike(recipientId: number): void {
    this.userService
      .sendLike(this.authService.currentUser.id, recipientId)
      .subscribe(
        (data) => this.alertify.success(`You liked ${this.user.knownAs}`),
        (error) => this.alertify.error(error)
      );
  }
}
