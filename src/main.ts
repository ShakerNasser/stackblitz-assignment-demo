import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UserFormComponent } from "./app/components/user-form/user-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-user-form></app-user-form>
  `,
  imports: [UserFormComponent],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
