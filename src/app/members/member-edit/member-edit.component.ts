import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  user: User;
  activeTab = 1;
  @ViewChild('editForm') editForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => (this.user = data['user']));
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
}
