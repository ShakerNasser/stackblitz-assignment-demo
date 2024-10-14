// src/app/models/user.model.ts

export interface UserBackend {
    first_name: string;
    last_name: string;
    age: number | null;
    email: string;
    skills: string[]; // Extend Functionality: Added skills property to user.model
  }
  
  export interface User extends UserBackend {
    full_name: string;
  }
  