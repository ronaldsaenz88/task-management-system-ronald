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

  hello(): { message: string } {
    return { message: 'Hello API' };
  }

  create(dto: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(dto);
    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['createdBy', 'organization'] });
  }

  findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id }, relations: ['createdBy', 'organization'] });
  }

  async update(id: number, dto: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
