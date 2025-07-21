import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommentForm } from '../comment-form/comment-form';
import { Comment as CommentType } from '../../interfaces/comment.interface';
import { CommentService } from '../../services/comment';

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
}
