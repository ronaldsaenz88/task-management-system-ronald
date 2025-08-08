import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TASK_CATEGORIES, TASK_STATUSES } from '../../constants/tasks';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { toDateInputString } from '../../utils/date'; // Adjust the import path as needed

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null; // If editing, pass in the task
  taskForm!: FormGroup;
  isEditMode = false;
  categories = TASK_CATEGORIES;
  statuses = TASK_STATUSES;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Always initialize the task object for ngModel to work!
  defaultTask = {
    title: '',
    category: this.categories[0],
    status: this.statuses[0],
    dueDate: '',
    description: ''
  };

  ngOnInit() {
    // If using route params for editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !this.task) {
      this.isEditMode = true;
      this.tasksService.getTask(+id).subscribe(task => {
        this.task = task;
        this.initForm();
      });
    } else {
      this.isEditMode = !!this.task;
      this.initForm();
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: [this.task?.title || this.defaultTask.title, Validators.required],
      category: [this.task?.category || this.defaultTask.category, Validators.required],
      status: [this.task?.status || this.defaultTask.status, Validators.required],
      dueDate: [this.task?.dueDate ? toDateInputString(this.task.dueDate) : '', Validators.required],
      description: [this.task?.description || this.defaultTask.description],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
    const formValue = { ...this.taskForm.value };

    if (this.isEditMode && this.task) {
      const updatedTask: Task = { ...this.task, ...formValue };
      this.tasksService.updateTask(updatedTask).subscribe(() => {
        this.showTaskBoard();
      });
    } else {
      this.tasksService.addTask(formValue).subscribe(() => {
        this.showTaskBoard();
      });
    }
  }

  showTaskBoard() {
    this.router.navigate(['/tasks']);
  }
}