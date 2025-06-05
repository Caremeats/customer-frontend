import { Component } from '@angular/core';
import { CustomerComponent } from './customer/customer.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerComponent, HttpClientModule],
  template: '<app-customer></app-customer>',
  styles: []
})
export class AppComponent {
  title = 'angular-crud-app';
}

