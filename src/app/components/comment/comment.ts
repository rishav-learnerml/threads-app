import { Component, effect, inject, input, signal } from '@angular/core';
import { CommentForm } from '../comment-form/comment-form';
import { Comment as CommentType } from '../../interfaces/comment.interface';
import { CommentDto, CommentService } from '../../services/comment';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-comment',
  imports: [CommentForm],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class Comment {
  expanded = signal(false);
  isReplying = signal(false);
  commentService = inject(CommentService);
  userService = inject(UserService);

  comment = input.required<CommentType>();
  nestedComments = signal<CommentType[]>([]);

  nestedCommentsEffect = effect(() => {
    if (this.expanded()) {
      this.commentService
        .getComments(this.comment()._id)
        .subscribe((comments) => {
          this.nestedComments.set(comments);
        });
    }
  });

  toggleExpand() {
    this.expanded.set(!this.expanded());
  }

  toggleLike() {
    const wasLiked = this.comment().liked;
    // Toggle liked state
    this.comment().liked = !wasLiked;
    // Update likes count and call API only if state changed
    if (!wasLiked) {
      this.comment().likes++;
      this.commentService.incrementLikes(this.comment()._id).subscribe();
    } else {
      if (this.comment().likes > 0) {
        this.comment().likes--;
        this.commentService.decrementLikes(this.comment()._id).subscribe();
      }
    }
  }

  toggleReply() {
    this.isReplying.set(!this.isReplying());
    if (this.isReplying()) {
      this.expanded.set(true); // Automatically expand when replying
    }
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
      parentId: this.comment()._id,
    };

    this.commentService.createComment(newComment).subscribe({
      next: (comment: any) => {
        this.nestedComments.update((currentComments) => [
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
