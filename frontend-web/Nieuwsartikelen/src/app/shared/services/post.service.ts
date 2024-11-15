import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from '../../../environments/environment';
import {PostFilter} from "../models/filter.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api: string = environment.apiUrl + 'api/post';
  private http: HttpClient = inject(HttpClient);

  // Methode om 1 post op te halen met ID
  getPost(id:number): Observable<Post> {
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  // Methode om alle posts op te halen
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }

  // Methode om alle concept posts op te halen
  getAllConcepts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/isConcept`);
  }

  // Methode om alle gepubliceerde posts op te halen
  getAllPublished(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/isPublished`);
  }

  // Methode om een nieuwe post toe te voegen
  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.api, post);
  }

  // Methode om een bestaande post te updaten
  updatePost(id: number, post: Post): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, post);
  }

  filterPosts(filter: PostFilter): Observable<Post[]> {
    return this.http.get<Post[]>(this.api).pipe(
      map((posts: Post[]) => posts.filter(post => this.isPostMatchingFilter(post, filter)))
    );
  }

  private isPostMatchingFilter(post: Post, filter: PostFilter): boolean {
    const matchesTitle = post.title.toLowerCase().includes(filter.title.toLowerCase());
    const matchesCategory = post.category.toLowerCase().includes(filter.category.toLowerCase());
    const matchesAuthor = post.author.toLowerCase().includes(filter.author.toLowerCase());

    return matchesTitle && matchesCategory && matchesAuthor;
  }

}
