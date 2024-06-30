import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../service/task.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  filterOption: string = 'status';
  sortOrder: 'ascending' | 'descending' = 'descending';
  showModal: boolean = false;
  logModalTask: Task | null = null; // Added property to store task for which log modal is opened
  searchQuery: string = '';

  @ViewChild('taskForm') taskFormElement!: ElementRef;

  constructor(
    private store: Store<AppState>,
    private taskService: TaskService
  ) {
    this.tasks$ = this.store.select((state) => state.tasks.tasks);
  }

  ngOnInit() {
    this.applyFilter();
  }

  onSearch() {
    this.applyFilter();
  }

  updateTaskStatus(id: string, status: 'to-do' | 'in-progress' | 'completed') {
    const task = this.filteredTasks.find((t) => t.id === id);
    if (task) {
      const updatedTask: Task = {
        ...task,
        status,
        history: [
          ...task.history,
          `Status changed to ${status} on ${new Date().toLocaleString()}`,
        ],
      };
      this.taskService.updateTaskDetails(updatedTask);
    }
  }

  onEditTask(task: Task) {
    this.selectedTask = { ...task };
    this.showModal = false;
    // this.scrollToTop();
  }

  closeEditForm() {
    this.selectedTask = null;
    document.body.classList.remove('no-scroll'); // Allow page scrolling
    const taskFormElement = document.querySelector('.task-form-container');
    if (taskFormElement) {
      taskFormElement.classList.remove('show-edit-form');
    }
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  submitUpdate() {
    if (this.selectedTask) {
      // const originalTask = { ...this.selectedTask }; // Make a copy of the original task
      const updatedTask: Task = {
        ...this.selectedTask,
        history: [...this.selectedTask.history], // Copy existing history
      };

      // Check each field for changes and update history
      // if (originalTask.title !== updatedTask.title) {
      //   updatedTask.history.push(
      //     `Title changed from '${originalTask.title}' to '${updatedTask.title}'`
      //   );
      // }
      // if (originalTask.description !== updatedTask.description) {
      //   updatedTask.history.push(
      //     `Description changed from '${originalTask.description}' to '${updatedTask.description}'`
      //   );
      // }
      // if (originalTask.dueDate !== updatedTask.dueDate) {
      //   updatedTask.history.push(
      //     `Due Date changed from '${originalTask.dueDate}' to '${updatedTask.dueDate}'`
      //   );
      // }
      // if (originalTask.priority !== updatedTask.priority) {
      //   updatedTask.history.push(
      //     `Priority changed from '${originalTask.priority}' to '${updatedTask.priority}'`
      //   );
      // }
      // if (originalTask.status !== updatedTask.status) {
      //   updatedTask.history.push(
      //     `Status changed from '${originalTask.status}' to '${updatedTask.status}'`
      //   );
      // }

      // Add generic update log
      updatedTask.history.push(
        `Details updated on ${new Date().toLocaleString()}`
      );

      this.taskService.updateTaskDetails(updatedTask);
      this.selectedTask = null;
      // this.scrollToTop(); // Scroll to top after the task is updated
    }
  }

  applyFilter() {
    this.tasks$.subscribe((tasks) => {
      let filtered = tasks;

      switch (this.filterOption) {
        case 'status':
          filtered = this.filterByStatus(tasks);
          break;
        case 'dueDate':
          filtered = this.filterByDueDate(tasks);
          break;
        case 'priority':
          filtered = this.filterByPriority(tasks);
          break;
        default:
          filtered = tasks;
          break;
      }

      if (this.searchQuery) {
        filtered = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            task.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }
      // console.log(this.searchQuery);
      this.filteredTasks = filtered;
    });
  }

  private filterByStatus(tasks: Task[]): Task[] {
    const filteredTasks = tasks.filter(
      (task) =>
        task.status === 'to-do' ||
        task.status === 'in-progress' ||
        task.status === 'completed'
    );
    return this.sortTasks(filteredTasks);
  }

  private filterByDueDate(tasks: Task[]): Task[] {
    const filteredTasks = tasks.filter(
      (task) => task.dueDate !== null && task.dueDate !== undefined
    );
    return this.sortTasks(filteredTasks, 'dueDate');
  }

  private filterByPriority(tasks: Task[]): Task[] {
    const filteredTasks = tasks.filter(
      (task) =>
        task.priority === 'low' ||
        task.priority === 'medium' ||
        task.priority === 'high'
    );
    return this.sortTasks(filteredTasks, 'priority');
  }

  toggleSortOrder() {
    this.sortOrder =
      this.sortOrder === 'ascending' ? 'descending' : 'ascending';
    this.applyFilter();
  }

  private sortTasks(
    tasks: Task[],
    sortBy: 'status' | 'dueDate' | 'priority' = 'status'
  ): Task[] {
    if (sortBy === 'status') {
      return tasks.sort((a, b) => {
        if (this.sortOrder === 'ascending') {
          return this.compareStatus(a.status, b.status);
        } else {
          return this.compareStatus(b.status, a.status);
        }
      });
    } else if (sortBy === 'dueDate') {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return this.sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return tasks.sort((a, b) => {
        const priorityA = priorityOrder[a.priority];
        const priorityB = priorityOrder[b.priority];
        return this.sortOrder === 'ascending'
          ? priorityA - priorityB
          : priorityB - priorityA;
      });
    }
    return tasks;
  }

  private compareStatus(
    statusA: 'to-do' | 'in-progress' | 'completed',
    statusB: 'to-do' | 'in-progress' | 'completed'
  ): number {
    const statusOrder = { 'to-do': 3, 'in-progress': 2, completed: 1 };
    return statusOrder[statusA] - statusOrder[statusB];
  }

  exportToCSV() {
    this.tasks$
      .pipe(map((tasks) => this.getFilteredTasks(tasks)))
      .subscribe((filteredTasks) => {
        const csvContent = this.convertToCSV(filteredTasks);
        this.downloadCSV(csvContent);
      });
  }

  private convertToCSV(tasks: Task[]): string {
    if (!tasks || tasks.length === 0) {
      return '';
    }

    const header = Object.keys(tasks[0]).join(',') + '\n';
    const rows = tasks
      .map((task) => {
        const values = Object.values(task)
          .map((value) => this.escapeCSVValue(value))
          .join(',');
        return values;
      })
      .join('\n');

    return header + rows;
  }

  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'string' && value.includes(',')) {
      return `"${value}"`;
    } else {
      return value.toString();
    }
  }

  private downloadCSV(content: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'tasks.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    return this.filteredTasks.length ? this.filteredTasks : tasks;
  }

  // Function to toggle log modal visibility
  toggleLogModal(task: Task) {
    this.logModalTask = task; // Set task for which log modal is opened
    this.showModal = true; // Show log modal
  }

  // Function to close log modal
  closeModal() {
    this.showModal = false; // Hide log modal
  }
}
