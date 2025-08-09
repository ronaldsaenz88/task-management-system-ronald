import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseURL = 'http://localhost:3001';
  private apiTaskUrl = `${this.baseURL}/api/tasks/`;

  // Constructor using inject (Angular 16+)
  private http = inject(HttpClient);

  // Get token and headers dynamically
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Add real HTTP API calls here for a real app
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiTaskUrl, { headers: this.getHeaders() });
  }

  // Get a single task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiTaskUrl}${id}`, { headers: this.getHeaders() });
  }

  // Create a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiTaskUrl, task, { headers: this.getHeaders() });
  }

  // Update an existing task
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiTaskUrl}${task.id}`, task, { headers: this.getHeaders() });
  }

  // Delete a task by ID
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiTaskUrl}${id}`, { headers: this.getHeaders() });
  }
}