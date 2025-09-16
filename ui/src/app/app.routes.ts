import { Routes } from '@angular/router';
import { DiscussionComponent } from './main/discussion.component/discussion.component';
import { FeedComponent } from './main/feed/feed.component';
import { CreateProfile } from './auth/create-profile/create-profile';

export const routes: Routes = [
    {path: 'feed', component: FeedComponent},
    {path: 'discussion', component: DiscussionComponent},
    {path: 'create-profile', component:CreateProfile},
    {path: '', redirectTo: 'feed', pathMatch: 'full' }
];
