import { Routes } from '@angular/router';
import { DiscussionComponent } from './main/discussion.component/discussion.component';
import { FeedComponent } from './main/feed.component/feed.component';
import { OauthComponent } from './auth/oauth.component/oauth.component';

export const routes: Routes = [
    {path: 'feed', component: FeedComponent},
    {path: 'discussion', component: DiscussionComponent},
    {path: '', redirectTo: 'feed', pathMatch: 'full' },
    {path: 'oauth', component: OauthComponent}
];
