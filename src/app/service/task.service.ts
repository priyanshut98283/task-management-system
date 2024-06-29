import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../models/task.model';
import {
  addTask,
  updateTaskStatus,
  updateTaskDetails,
  deleteTask,
} from '../store/task.actions';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private store: Store) {}

  addTask(task: Task) {
    this.store.dispatch(addTask({ task }));
  }

  updateTaskStatus(id: string, status: 'to-do' | 'in-progress' | 'completed') {
    this.store.dispatch(updateTaskStatus({ id, status }));
  }

  updateTaskDetails(task: Task) {
    this.store.dispatch(updateTaskDetails({ task }));
  }

  deleteTask(id: string) {
    this.store.dispatch(deleteTask({ id }));
  }
}
