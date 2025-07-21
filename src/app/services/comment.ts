import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment.interface';
import { environment } from '../environments';

export interface CommentDto {
  text: string;
  userId: string;
  parentId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);

  getComments(parentId: string = '') {
    let url = `${environment.apiBaseUrl}/comments`;
    if (parentId) {
      url += `?parentId=${parentId}`;
    }
    return this.http.get<Comment[]>(url);
  }

  incrementLikes(commentId: string) {
    const url = `${environment.apiBaseUrl}/comments/${commentId}/like`;
    return this.http.get<Comment[]>(url);
  }

  decrementLikes(commentId: string) {
    const url = `${environment.apiBaseUrl}/comments/${commentId}/dislike`;
    return this.http.get<Comment[]>(url);
  }

  createComment(comment: CommentDto) {
    return this.http.post<CommentDto>(
      `${environment.apiBaseUrl}/comments`,
      comment
    );
  }
}
