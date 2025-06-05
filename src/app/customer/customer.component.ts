import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styles: []
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  customerForm: FormGroup;
  isEditing: boolean = false;
  editingId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      contact_number: ['', [Validators.required, Validators.maxLength(15)]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;

      if (this.isEditing && this.editingId) {
        this.customerService.updateCustomer(this.editingId, formData).subscribe({
          next: () => {
            this.loadCustomers();
            this.resetForm();
          },
          error: (error) => console.error('Error updating customer:', error)
        });
      } else {
        this.customerService.createCustomer(formData).subscribe({
          next: () => {
            this.loadCustomers();
            this.resetForm();
          },
          error: (error) => console.error('Error creating customer:', error)
        });
      }
    }
  }

  editCustomer(customer: Customer): void {
    this.isEditing = true;
    this.editingId = customer.id!;
    this.customerForm.patchValue({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      contact_number: customer.contact_number
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => console.error('Error deleting customer:', error)
      });
    }
  }

  resetForm(): void {
    this.customerForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  get first_name() { return this.customerForm.get('first_name'); }
  get last_name() { return this.customerForm.get('last_name'); }
  get email() { return this.customerForm.get('email'); }
  get contact_number() { return this.customerForm.get('contact_number'); }
}
