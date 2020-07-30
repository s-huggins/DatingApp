import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit, OnDestroy {
  user: User;
  activeTab = 1;
  @ViewChild('editForm') editForm: NgForm;
  photoUrlSubscription: Subscription;
  photoUrl: string;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => (this.user = data['user']));
    this.photoUrlSubscription = this.authService.currentPhotoUrl$.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }

  ngOnDestroy(): void {
    this.photoUrlSubscription.unsubscribe();
  }

  selectTab(tabNo: number): void {
    this.activeTab = tabNo;
  }

  updateUser(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      () => {
        this.alertify.success('Profile updated');
        this.editForm.reset(this.user);
      },
      (err) => this.alertify.error('Update failed')
    );
  }

  updateMainPhoto(photoUrl: string): void {
    this.user.photoUrl = photoUrl;
  }
}
