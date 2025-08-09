import { Component, OnInit, inject } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TASK_CATEGORIES, TASK_STATUSES } from '../../constants/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks-board',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.css']
})
export class TasksBoardComponent implements OnInit {
  tasks: Task[] = [];
  filterCategory = '';
  filterStatus = '';
  filterText = '';
  sortColumn: keyof Task | '' = '';
  sortAsc = true;
  categories = TASK_CATEGORIES;
  statuses = TASK_STATUSES;

  // Constructor using inject (Angular 16+)
  private tasksService = inject(TasksService);
  private router = inject(Router);

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


  getTasksByStatus(status: string): Task[] {
    return this.tasks
      .filter(task => task.status === status)
      .filter(task => 
        (!this.filterCategory || task.category === this.filterCategory) &&
        (!this.filterText || 
          task.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
          (task.description ?? '').toLowerCase().includes(this.filterText.toLowerCase())
        )
      );
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = status;

      // Update in DB via API
      this.tasksService.updateTask(task).subscribe({
        next: updatedTask => {
          // Optionally update your UI with the response
          console.log('Task status updated in DB:', updatedTask);
        },
        error: err => {
          // Optionally revert UI or show an error
          console.error('Failed to update task status:', err);
        }
      });

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  listTasks() {
    this.router.navigate(['/tasks', 'list']);
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