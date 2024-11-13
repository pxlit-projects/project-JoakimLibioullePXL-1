export class PostFilter {
  title: string;
  text: string;
  author: string;
  category: string;

  constructor(title: string = '', text: string = '', author: string = '', category: string = '') {
    this.title = title;
    this.text = text;
    this.author = author;
    this.category = category;
  }
}
