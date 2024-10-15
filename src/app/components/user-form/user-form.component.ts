// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms'
import { User } from '../../models/user.model'
import { UserService } from '../../services/user-service.service'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      full_name: [{ value: '', disabled: true }],
      age: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      skills: this.fb.array([])
    })
  }

  get skills(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }

  ngOnInit() {
    this.loadUserData()
  }

  loadUserData() {
    this.loading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.loading = false;

        // Check if user.skills is an array before iterating
        if (Array.isArray(user.skills)) {
          user.skills.forEach(skill => this.addSkill(skill));
        } else {
          console.warn('User skills are not available or not an array', user.skills);
        }
      },
      error: () => {
        this.error = 'Failed to load user data';
        this.loading = false;
      }
    });
  }


  setSkills(skills: string[]) {
    skills.forEach(skill => this.addSkill(skill));
  }

  addSkill(skill: string = '') {
    this.skills.push(this.fb.control(skill, Validators.required));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSave() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value as User)
        .subscribe({
          next: () => alert('User updated successfully'),
          error: () => alert('Error updating user')
        })
    }
  }

  handleFullname(){
    this.userForm.controls["full_name"].setValue(`${this.userForm.controls["first_name"]?.value || ''} ${this.userForm.controls["last_name"]?.value || ''}`)

    // No spaces
    if (!this.userForm.controls["first_name"]?.value){
      this.userForm.controls["full_name"].setValue(this.userForm.controls["last_name"]?.value)
    }
  }

  // Error handling methods for the form fields
  getErrorMessage(controlName: string, index?: number): string | null {
    if (index !== undefined) {
      const skillControl = this.skills.at(index);
      if (skillControl && skillControl.errors && skillControl.errors['required']) {
        return 'This field is required'; 
      }
    } else {
      const control = this.userForm.get(controlName);
      if (control && control.errors && control.errors['required']) {
        return 'This field is required'; 
      } else if (control && control.errors && control.errors['email']) {
        return 'Enter a valid email';
      }
    }
    return null; 
  }
}
