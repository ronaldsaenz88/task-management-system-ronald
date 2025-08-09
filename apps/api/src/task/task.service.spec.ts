import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '@libs/data/src/entities/task';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let repo: Repository<Task>;

  const mockTask = { id: 1, title: 'Test Task', createdBy: {}, organization: {} } as Task;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockImplementation(({ where }) => 
      where.id === 1 ? mockTask : null
    ),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a task', async () => {
      const dto = { title: 'New Task' };
      await expect(service.create(dto)).resolves.toEqual(mockTask);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks with relations', async () => {
      await expect(service.findAll()).resolves.toEqual([mockTask]);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['createdBy', 'organization'] });
    });
  });

  describe('findOne', () => {
    it('should return a task by id with relations', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['createdBy', 'organization'] });
    });

    it('should return null if task not found', async () => {
      const result = await service.findOne(2);
      expect(result).toBeNull();
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 2 }, relations: ['createdBy', 'organization'] });
    });
  });

  describe('update', () => {
    it('should update a task and return the updated entity', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);
      await expect(service.update(1, { title: 'Updated' })).resolves.toEqual(mockTask);
      expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should delete a task by id', async () => {
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});