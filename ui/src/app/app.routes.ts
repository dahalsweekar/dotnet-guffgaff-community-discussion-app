import { Routes } from '@angular/router';
import { DiscussionComponent } from './main/discussion.component/discussion.component';
import { FeedComponent } from './main/feed.component/feed.component';

export const routes: Routes = [
    {path: 'feed', component: FeedComponent},
    {path: 'discussion', component: DiscussionComponent},
    {path: '', redirectTo: 'feed', pathMatch: 'full' }
];
