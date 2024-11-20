export class Post {
  title: string;
  text: string;
  author: string;
  category: string;
  isConcept: boolean;
  createdAt?: Date;
  id?: number;

  constructor(title: string, text: string, author: string, category: string, isConcept: boolean) {
    this.title = title;
    this.text = text;
    this.author = author;
    this.category = category;
    this.isConcept = isConcept;
  }
}
