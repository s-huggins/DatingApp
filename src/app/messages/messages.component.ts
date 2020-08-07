import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  faEnvelope,
  faEnvelopeOpen,
  faPaperPlane,
  IconDefinition,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  faEnvelope: IconDefinition = faEnvelope;
  faEnvelopeOpen: IconDefinition = faEnvelopeOpen;
  faPaperPlane: IconDefinition = faPaperPlane;
  faTrashAlt: IconDefinition = faTrashAlt;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages(): void {
    this.userService
      .getMessages(
        this.authService.currentUser.id,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        (error) => this.alertify.error(error)
      );
  }

  deleteMessage(id: number): void {
    this.alertify.confirm(
      'Are you sure you want to delete the message?',
      () => {
        this.userService
          .deleteMessage(id, this.authService.currentUser.id)
          .subscribe(
            () => {
              this.messages.splice(
                this.messages.findIndex((m) => m.id == id),
                1
              );
              this.alertify.success('Message deleted');
            },
            (error) => this.alertify.error('Failed to delete the message')
          );
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
