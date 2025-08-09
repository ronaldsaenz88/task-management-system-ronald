import { Route } from '@angular/router';
import { TasksBoardComponent } from './pages/tasks-board/tasks-board.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';

export const appRoutes: Route[] = [
  { path: '', component: TasksListComponent },
  { path: 'tasks', component: TasksBoardComponent },
  { path: 'tasks/list', component: TasksListComponent },
  { path: 'tasks/add', component: TaskFormComponent },
  { path: 'tasks/edit/:id', component: TaskFormComponent },
];
