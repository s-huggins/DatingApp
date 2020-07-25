import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  register(): void {
    this.authService.register(this.model).subscribe(
      () => console.log('registration successful'),
      (error) => console.log(error)
    );
  }

  cancel(): void {
    this.cancelRegister.emit();
  }
}
