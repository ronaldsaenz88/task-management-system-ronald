import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@libs/data/src/entities/task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  /**
   * Creates a new task.
   * @param dto - Partial task data to create a new task.
   * @returns The created task.
   */
  create(dto: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(dto);
    return this.taskRepository.save(task);
  }

  /**
   * Retrieves all tasks with their relations.
   * @returns An array of tasks.
   */
  findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['createdBy', 'organization'] });
  }

  /**
   * Finds a task by its ID with relations.
   * @param id - The ID of the task to find.
   * @returns The found task or null if not found.
   */
  findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id }, relations: ['createdBy', 'organization'] });
  }

  /**
   * Updates a task by its ID.
   * @param id - The ID of the task to update.
   * @param dto - Partial task data to update the task.
   * @returns The updated task.
   */
  async update(id: number, dto: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Deletes a task by its ID.
   * @param id - The ID of the task to delete.
   */
  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
