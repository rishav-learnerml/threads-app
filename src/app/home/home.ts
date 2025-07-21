import { Component, inject, OnInit, signal } from '@angular/core';
import { Comment as CommentType } from '../interfaces/comment.interface';

import { CommentDto, CommentService } from '../services/comment';
import { Comment } from '../components/comment/comment';
import { CommentForm } from '../components/comment-form/comment-form';
import { UserService } from '../services/user';

@Component({
  selector: 'app-home',
  imports: [Comment, CommentForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  commentService = inject(CommentService);
  userService = inject(UserService);
  comments = signal<CommentType[]>([]);
  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.commentService.getComments().subscribe((comments) => {
      this.comments.set(comments);
    });
  }

  createComment(event: { text: string }) {
    const user = this.userService.getUserFromStorage();
    if (!user) {
      console.error('User not found in storage');
      return;
    }
    const newComment: CommentDto = {
      text: event.text,
      userId: user._id,
    };

    this.commentService.createComment(newComment).subscribe({
      next: (comment: any) => {
        this.comments.update((currentComments) => [
          comment,
          ...currentComments,
        ]);
      },
      error: (err) => {
        console.error('Error creating comment:', err);
      },
    });
  }
}
