import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../service/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  title = '';
  description = '';
  dueDate = '';
  priority: 'low' | 'medium' | 'high' = 'low';

  constructor(private taskService: TaskService) {}

  addTask() {
    const newTask: Task = {
      id: uuidv4(),
      title: this.title,
      description: this.description,
      dueDate: new Date(this.dueDate),
      priority: this.priority,
      status: 'to-do',
      history: [`Task created on ${new Date().toLocaleString()}`],
    };

    this.taskService.addTask(newTask);
    this.resetForm();
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    this.dueDate = formattedDate;
    this.priority = 'low';
  }
}
