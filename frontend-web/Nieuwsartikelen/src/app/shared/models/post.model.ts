export class Post {
  text: string;
  author: string;
  category: string;
  isConcept: boolean;
  createdAt?: Date;
  id?: number;

  constructor(text: string, author: string, category: string, isConcept: boolean = true) {
    this.text = text;
    this.author = author;
    this.category = category;
    this.isConcept = isConcept;
  }
}
