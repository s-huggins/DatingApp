import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<void>();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
    };
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
          ],
        ],
        confirmPassword: [''],
      },
      {
        validators: [
          this.confirmPasswordRequiredValidator,
          this.passwordMatchValidator,
        ],
      }
    );
  }

  confirmPasswordRequiredValidator = (
    group: FormGroup
  ): { [key: string]: boolean } => {
    return group.get('password').value && !group.get('confirmPassword').value
      ? { requireConfirm: true }
      : null;
  };

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } {
    return group.get('password').value === group.get('confirmPassword').value
      ? null
      : { passwordMismatch: true };
  }

  register(): void {
    if (this.registerForm.valid) {
      this.user = { ...this.registerForm.value };
      this.authService.register(this.user).subscribe(
        () => this.alertify.success('Registration successful'),
        (error) => this.alertify.error(error),
        () => {
          this.authService
            .login(this.user)
            .subscribe(() => this.router.navigate(['/members']));
        }
      );
    }
  }

  cancel(): void {
    this.cancelRegister.emit();
  }
}
