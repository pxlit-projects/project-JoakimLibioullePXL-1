import { Routes } from '@angular/router';
import {confirmLeaveGuard} from "./confirm-leave.guard";
import {PostConceptListComponent} from "./post-conceptlist/post-conceptlist.component";
import {AddPostComponent} from "./add-post/add-post.component";
import {PostPublishedListComponent} from "./post-publishedlist/post-publishedlist.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";

export const routes: Routes = [
  {path: 'concepts', component: PostConceptListComponent},
  {path: 'published', component: PostPublishedListComponent},
  {path: 'add', component: AddPostComponent},
  {path: '', redirectTo: 'published', pathMatch: 'full'},
  {path: 'post/:id', component: PostDetailComponent},
  {path: 'add', component: AddPostComponent, canDeactivate: [confirmLeaveGuard]},
];
