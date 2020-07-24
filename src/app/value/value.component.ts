import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css'],
})
export class ValueComponent implements OnInit {
  private url = 'http://localhost:5000/api/values';
  values: any[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getValues();
  }

  getValues(): void {
    this.http.get<any[]>(this.url).subscribe((vals) => (this.values = vals));
  }
}
