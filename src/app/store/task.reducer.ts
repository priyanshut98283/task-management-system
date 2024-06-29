import { Action, createReducer, on } from '@ngrx/store';
import {
  addTask,
  updateTaskStatus,
  updateTaskDetails,
  deleteTask,
  loadTasks,
} from './task.actions';
import { Task } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: [],
};

const _taskReducer = createReducer(
  initialState,
  on(addTask, (state, { task }) => {
    const newTasks = [...state.tasks, task];
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    return { ...state, tasks: newTasks };
  }),
  on(updateTaskStatus, (state, { id, status }) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return { ...state, tasks: updatedTasks };
  }),
  on(updateTaskDetails, (state, { task }) => {
    const updatedTasks = state.tasks.map((t) =>
      t.id === task.id ? { ...task } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return { ...state, tasks: updatedTasks };
  }),
  on(deleteTask, (state, { id }) => {
    const filteredTasks = state.tasks.filter((task) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    return { ...state, tasks: filteredTasks };
  }),
  on(loadTasks, (state, { tasks }) => ({ ...state, tasks }))
);

export function taskReducer(state: TaskState | undefined, action: Action) {
  return _taskReducer(state, action);
}
