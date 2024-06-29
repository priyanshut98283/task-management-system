// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTasks } from './store/task.actions';
import { LocalStorageService } from './service/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    const tasks = this.localStorageService.getTasks();
    this.store.dispatch(loadTasks({ tasks }));
  }
}
