import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostServices } from '../../../services/post.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../../services/page.services';

@Component({
  selector: 'app-post',
  imports: [ CommonModule,
    FormsModule
   ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{

  thoughtText: string = '';
  thoughts: string = '';

  constructor(private postServices: PostServices, private dialogServices: DialogBoxServices, private pageServices: PageServices){

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
        this.dialogServices.showInfo('Information', 'Post successful.')
        .afterClosed()
        .subscribe(() => {
          this.pageServices.reloadComponent('post');
        })
      },
      error: (error) => {
        this.dialogServices.showError('Failed', 'Failed to save post.');
      }
    });
  }
}
