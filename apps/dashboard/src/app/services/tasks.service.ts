import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseURL = 'http://localhost:3001';
  private apiTaskUrl = `${this.baseURL}/api/tasks/`;

  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('jwt');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private tasks: Task[] = [
    { id: 1, title: 'Initial Task', category: 'Work', status: 'todo', dueDate: '2025-08-10', description: 'Demo task' },
    { id: 2, title: 'Design homepage', description: 'Design the main landing page', category: 'UI', status: 'inprogress', dueDate: '2025-08-10' },
    { id: 3, title: 'Setup backend', description: 'Initialize database', category: 'Backend', status: 'todo', dueDate: '2025-08-15' },
    { id: 4, title: 'Write docs', description: 'Document API endpoints', category: 'Documentation', status: 'done', dueDate: '2025-08-09' },
    // ...more demo data
  ];

  // Constructor using inject (Angular 16+)
  //private http = inject(HttpClient);

  getHardcodeTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  // Add real HTTP API calls here for a real app
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiTaskUrl, { headers: this.headers });
  }

  // Get a single task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiTaskUrl}${id}`, { headers: this.headers });
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiTaskUrl, task, { headers: this.headers });
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiTaskUrl}${task.id}`, task, { headers: this.headers });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiTaskUrl}${id}`, { headers: this.headers });
  }
}