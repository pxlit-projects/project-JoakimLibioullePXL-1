export class Review {
  id?: number;
  postId: number;
  status: Status;
  comment?: string;

  constructor(postId: number, status: Status, comment?: string) {
    this.postId = postId;
    this.status = status;
    this.comment = comment;
  }
}

export enum Status {
  ACCEPTED = "ACCEPTED",
  DENIED = "DENIED",
}
