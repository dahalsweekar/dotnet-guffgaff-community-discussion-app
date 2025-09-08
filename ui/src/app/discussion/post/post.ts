import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostServices } from '../../services/post.services';

@Component({
  selector: 'app-post',
  imports: [ CommonModule,
    FormsModule
   ],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post implements OnInit{

  thoughtText: string = '';
  thoughts: string = '';

  constructor(private postServices: PostServices){

  }

  ngOnInit(){

  }

  postThought(): void{
    var thought = {
      UserId: '',
      ThoughtText: this.thoughtText
    }
    this.postServices.postThoughtfn(thought).subscribe({
      next: (response) => {

      },
      error: (error) => {

      }
    });
  }
}
