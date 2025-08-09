import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from '@libs/data/src/entities/task';
import { TaskService } from './task.service';

@Controller('tasks')
/**
 * TaskController handles CRUD operations for tasks.
 * It uses JWT authentication to secure the endpoints.
 */
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  /**
   * Creates a new task.
   * @param dto - Partial task data to create a new task.
   * @returns The created task.
   */
  async create(@Body() dto: Partial<Task>) {
    return this.taskService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  /**
   * Retrieves all tasks with their relations.
   * @returns An array of tasks.
   */
  async findAll() {
    return this.taskService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  /**
   * Retrieves a task by its ID.
   * @param id - The ID of the task to retrieve.
   * @returns The found task or null if not found.
   */
  async findOne(@Param('id') id: number) {
    return this.taskService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  /**
   * Updates a task by its ID.
   * @param id - The ID of the task to update.
   * @param dto - Partial task data to update the task.
   * @returns The updated task.
   */
  async update(@Param('id') id: number, @Body() dto: Partial<Task>) {
    return this.taskService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  /**
   * Deletes a task by its ID.
   * @param id - The ID of the task to delete.
   * @returns An object indicating the deletion status.
   */
  async remove(@Param('id') id: number) {
    await this.taskService.remove(+id);
    return { deleted: true };
  }
}

// import { Roles } from '@yourorg/auth';
// import { Role } from '@yourorg/auth';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // your JWT guard
// import { RolesGuard } from '@yourorg/auth';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.Admin, Role.Manager)
// @Get()