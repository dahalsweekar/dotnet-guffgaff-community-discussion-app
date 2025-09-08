import { Routes } from '@angular/router';
import { Post } from './discussion/post/post';
import { Discussion } from './discussion/discussion';
import { Feed } from './feed/feed';
import { Comments } from './discussion/comments/comments';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
    {path: 'register', component:Register},
    {path: 'login', component: Login},
    {path: 'post', component:Post},
    {path: 'discussion', component: Discussion},
    {path: 'feed', component: Feed},
    {path: 'comments', component: Comments}
];
