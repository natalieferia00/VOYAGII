import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: number;
  text: string;
  date: string;
}

@Component({
  selector: 'app-comments-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-form.html',
  styleUrls: ['./comments-form.scss']
})
export class CommentsFormComponent {
deleteTask(_t31: number) {
throw new Error('Method not implemented.');
}
editTask(_t31: number) {
throw new Error('Method not implemented.');
}
  commentText = '';
  comments: Comment[] = [];
  editingId: number | null = null;

  constructor() {
    this.loadComments();
  }

  addComment() {
    if (this.commentText.trim()) {
      if (this.editingId !== null) {
        // Edit existing
        const comment = this.comments.find(c => c.id === this.editingId);
        if (comment) {
          comment.text = this.commentText;
        }
        this.editingId = null;
      } else {
        // Add new
        const newComment: Comment = {
          id: Date.now(),
          text: this.commentText.trim(),
          date: new Date().toLocaleString()
        };
        this.comments.unshift(newComment);
      }
      this.commentText = '';
      this.saveComments();
    }
  }

  editComment(comment: Comment) {
    this.commentText = comment.text;
    this.editingId = comment.id;
  }

  deleteComment(id: number) {
    this.comments = this.comments.filter(c => c.id !== id);
    this.saveComments();
  }

  saveComments() {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

  loadComments() {
    const saved = localStorage.getItem('comments');
    this.comments = saved ? JSON.parse(saved) : [];
  }

  cancelEdit() {
    this.editingId = null;
    this.commentText = '';
  }
}
