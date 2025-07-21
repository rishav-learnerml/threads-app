import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment.interface';
import { environment } from '../environments';

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
    console.log(url)
    return this.http.get<Comment[]>(url);
  }

  decrementLikes(commentId: string) {
    const url = `${environment.apiBaseUrl}/comments/${commentId}/dislike`;
    return this.http.get<Comment[]>(url);
  }
}
