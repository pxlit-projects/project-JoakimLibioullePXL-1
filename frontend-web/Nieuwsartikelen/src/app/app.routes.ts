import { Routes } from '@angular/router';
import { RoleGuard } from './role.guard'; // Import de RoleGuard
import { PostConceptListComponent } from './post-conceptlist/post-conceptlist.component';
import { AddPostComponent } from './add-post/add-post.component';
import { PostPublishedListComponent } from './post-publishedlist/post-publishedlist.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'concepts', component: PostConceptListComponent, canActivate: [RoleGuard], data: { role: 'Redacteur' } },
  { path: 'published', component: PostPublishedListComponent },
  { path: 'add', component: AddPostComponent, canActivate: [RoleGuard], data: { role: 'Redacteur' } },
  { path: '', redirectTo: 'published', pathMatch: 'full' },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'edit-post/:id', component: EditPostComponent, canActivate: [RoleGuard], data: { role: 'Redacteur' } },
  { path: 'login', component: LoginComponent }
];
