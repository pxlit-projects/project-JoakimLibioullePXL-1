export class Comment {
  id?:number;
  postId: number;
  username: string;
  comment: string;

  constructor(postId:number, username:string, comment:string) {
    this.postId = postId;
    this.username = username;
    this.comment = comment;
  }
}
