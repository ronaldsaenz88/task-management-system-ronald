import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from '@libs/data/src/entities/task';

// Dummy guard implementation for tests
class MockJwtAuthGuard {
  canActivate() {
    return true;
  }
}

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Task' }]),
    findOne: jest.fn().mockImplementation((id) => (id === 1 ? { id, title: 'Test Task' } : null)),
    update: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const dto: Partial<Task> = { title: 'New Task' };
      expect(await controller.create(dto)).toEqual({ id: 1, title: 'New Task' });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      expect(await controller.findAll()).toEqual([{ id: 1, title: 'Test Task' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      expect(await controller.findOne(1)).toEqual({ id: 1, title: 'Test Task' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('should return null if task not found', async () => {
      expect(await controller.findOne(2)).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(2);
    });
  });

  describe('update', () => {
    it('should update a task by id', async () => {
      const dto: Partial<Task> = { title: 'Updated Task' };
      expect(await controller.update(1, dto)).toEqual({ id: 1, title: 'Updated Task' });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a task by id', async () => {
      expect(await controller.remove(1)).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});