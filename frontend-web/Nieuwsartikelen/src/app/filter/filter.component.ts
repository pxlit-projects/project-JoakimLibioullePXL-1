import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { PostFilter } from "../shared/models/filter.model";

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  filter: PostFilter = { title: '', text: '', author: '', category: '' };

  @Output() filterChanged = new EventEmitter<PostFilter>();

  onSubmit(form: any) {
    if (form.valid) {
      this.filter.title = this.filter.title.toLowerCase();
      this.filter.text = this.filter.text.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      this.filter.category = this.filter.category.toLowerCase();
      this.filterChanged.emit(this.filter);
    }
  }
}
