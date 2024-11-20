import {inject, Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private api: string = environment.apiUrl + 'comment/api/comment';
  private http: HttpClient = inject(HttpClient);

  getCommentByPostId(id:number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.api + id);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.api, Comment);
  }

  updateComment(id: number, comment: Comment): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, comment);
  }

  deleteComment(id:number): Observable<void>{
    return this.http.delete(this.api + id);
  }
}
