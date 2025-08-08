import { Component, OnInit } from '@angular/core';
import { TASK_CATEGORIES, TASK_STATUSES } from '../../constants/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  filterCategory = '';
  filterStatus = '';
  filterText = '';
  sortColumn: keyof Task | '' = '';
  sortAsc = true;
  categories = TASK_CATEGORIES;
  statuses = TASK_STATUSES;

  constructor(private tasksService: TasksService, private router: Router) {}

  ngOnInit() {
    this.tasksService.getTasks().subscribe(tasks => 
      {
        console.log('Tasks fetched:', tasks);
        this.tasks = tasks
      }
    );
  }

  get filteredTasks() {
    let filtered = this.tasks.filter(task =>
      (!this.filterCategory || task.category === this.filterCategory) &&
      (!this.filterStatus || task.status === this.filterStatus) &&
      (
        !this.filterText ||
        task.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        (task.description ?? '').toLowerCase().includes(this.filterText.toLowerCase())
      )
    );

    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const valA = this.sortColumn ? a[this.sortColumn] : null;
        const valB = this.sortColumn ? b[this.sortColumn] : null;
        if ((valA ?? '') < (valB ?? '')) return this.sortAsc ? -1 : 1;
        if ((valA ?? '') > (valB ?? '')) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  setSort(column: keyof Task) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
  }

  showTaskBoard() {
    this.router.navigate(['/tasks']);
  }

  addTask() {
    this.router.navigate(['/tasks', 'add']);
  }

  editTask(task: Task) {
    this.router.navigate(['/tasks', 'edit', task.id]);
    // Example: redirects to /tasks/edit/123 if task.id is 123
  }

  deleteTask(task: Task) {
    if (!task.id) return; // Safety check
    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        // After successful deletion, redirect to the task board
        this.router.navigate(['/tasks']);
      },
      error: err => {
        // Optional: handle error
        console.error('Delete failed', err);
      }
    });
  }
}