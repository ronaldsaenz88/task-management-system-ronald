import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Task } from '@libs/data/src/entities/task';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() dto: Partial<Task>) {
    return this.taskService.create(dto);
  }

  @Get()
  async findAll() {
    return this.taskService.findAll();
  }

  @Get('hello')
  async hello() {
    return this.taskService.hello();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.taskService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: Partial<Task>) {
    return this.taskService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.taskService.remove(+id);
    return { deleted: true };
  }
}
