import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { UserModel } from '../../models/userVM';

@Component({
  selector: 'app-create-profile',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.scss'
})
export class CreateProfile implements OnInit{

  user: UserModel = {}
  ConfirmPassword: string = '';

  constructor(){

  }

  ngOnInit(): void {
    
  }
  
  validateUserEmail(): void{

  }

  create(): void{

  }

  cancel(): void{

  }
  
}
