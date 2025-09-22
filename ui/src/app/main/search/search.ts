import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HighlightPipe } from '../../services/highlight/highlight-pipe';
import { TimeAgoPipe } from '../../services/time-ago/time-ago-pipe';
import { PostServices } from '../../services/post.services';
import { PostModel } from '../../models/postVM';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { LocalStorage } from '../../services/localStorage.services';

@Component({
  selector: 'app-search',
  imports: [ MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, HighlightPipe, FormsModule, TimeAgoPipe],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {

  searchText: string = ''
  searchPost: PostModel[] = [];

  constructor(private postServices: PostServices, private dialogServices:DialogBoxServices, private localStorage: LocalStorage,
    private router: Router
  ){}

  onSearchChange() {
  const keyword = {'SearchKey': this.searchText.toLowerCase()};
  this.postServices.searchPostfn(keyword).subscribe({
    next: (response) => {
      this.searchPost = response.Data
    },
    error: (error) => {
      this.dialogServices.showError('Failed', 'Unable to perform search');
    }
  });
}

  navigateToPost(postId: string): void{
    this.localStorage.storeSession('PostID', postId.toString());
    this.router.navigateByUrl('/discussion');
  }

}


