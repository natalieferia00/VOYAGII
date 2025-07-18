import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks-section.component.html',
  styleUrls: ['./tasks-section.component.scss'],
})
export class TasksSectionComponent {
  tasks: string[] = [];
  taskInput: string = '';
  isEditing: boolean = false;
  editingIndex: number = -1;

  addOrUpdateTask() {
    if (this.isEditing && this.editingIndex > -1) {
      this.tasks[this.editingIndex] = this.taskInput.trim();
      this.resetForm();
    } else if (this.taskInput.trim() !== '') {
      this.tasks.push(this.taskInput.trim());
      this.taskInput = '';
    }
  }

  editTask(index: number) {
    this.taskInput = this.tasks[index];
    this.isEditing = true;
    this.editingIndex = index;
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.resetForm();
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.taskInput = '';
    this.isEditing = false;
    this.editingIndex = -1;
  }
}
