import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { faClock, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() userId: number;
  messages: Message[];
  faClock: IconDefinition = faClock;
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    const currentUserId = this.authService.currentUser.id;

    this.userService
      .getMessageThread(this.authService.currentUser.id, this.userId)
      .pipe(
        tap((messages) => {
          messages.forEach((msg) => {
            if (!msg.isRead && msg.recipientId === currentUserId) {
              this.userService.markAsRead(msg.id, currentUserId);
            }
          });
        })
      )
      .subscribe(
        (messages) => (this.messages = messages),
        (error) => this.alertify.error(error)
      );
  }

  sendMessage(): void {
    this.newMessage.recipientId = this.userId;
    this.userService
      .sendMessage(this.authService.currentUser.id, this.newMessage)
      .subscribe(
        (message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        },
        (error) => this.alertify.error(error)
      );
  }
}
