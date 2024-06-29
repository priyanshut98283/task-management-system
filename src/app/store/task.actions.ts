import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());

export const updateTaskStatus = createAction(
  '[Task] Update Task Status',
  props<{ id: string; status: 'to-do' | 'in-progress' | 'completed' }>()
);

export const updateTaskDetails = createAction(
  '[Task] Update Task Details',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);

export const loadTasks = createAction(
  '[Task] Load Tasks',
  props<{ tasks: Task[] }>()
);
