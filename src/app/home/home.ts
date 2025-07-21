import { Component, inject, OnInit, signal } from '@angular/core';
import { Comment as CommentType } from '../interfaces/comment.interface';

import { CommentService } from '../services/comment';
import { Comment } from '../components/comment/comment';

@Component({
  selector: 'app-home',
  imports: [Comment],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  commentService = inject(CommentService);
  comments = signal<CommentType[]>([]);
  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.commentService.getComments().subscribe((comments) => {
      this.comments.set(comments);
    });
  }
}
