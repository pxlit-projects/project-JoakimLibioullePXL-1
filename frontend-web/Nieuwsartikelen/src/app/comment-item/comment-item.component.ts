import {Component, inject, Input} from '@angular/core';
import { CommentService } from '../shared/services/comment.service';
import { Comment } from '../shared/models/comment.model';
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from '@angular/common';
@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  standalone: true,
  imports: [
    FormsModule, NgIf
  ],
  styleUrls: ['./comment-item.component.css']
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  editing = false; // Staat van bewerken
  editedComment: string = '';

  constructor(private commentService: CommentService) {}

  startEditing(): void {
    this.editing = true;
    this.editedComment = this.comment.comment; // Initieer met bestaande tekst
  }

  saveComment(): void {
    if (this.editedComment.trim()) {
      const updatedComment: Comment = { ...this.comment, comment: this.editedComment };
      this.commentService.updateComment(this.id, updatedComment).subscribe(() => {
        this.comment.comment = this.editedComment;
        this.editing = false;
      });
    }
  }

  deleteComment(): void {
    this.commentService.deleteComment(this.id).subscribe(() => {
      // Voorzie een manier om de verwijderde comment uit de lijst te halen
      console.log(`Comment with id ${this.comment.id} deleted`);
    });
  }
}
