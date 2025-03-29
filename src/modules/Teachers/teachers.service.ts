import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher, CreateTeacherDto, UpdateTeacherDto } from './dto';

@Injectable()
export class TeachersService {
  private teachers: Teacher[] = [
    { id: 1, name: 'Adham', age: 22, salary: 40 },
    { id: 2, name: 'Zyad', age: 33, salary: 50 },
    { id: 3, name: 'Galal', age: 22, salary: 70 },
    { id: 4, name: 'Ali', age: 15, salary: 60 },
    { id: 5, name: 'Mona', age: 25, salary: 20 },
  ];

  findAll(): Teacher[] {
    return this.teachers;
  }

  findOne(id: number): Teacher {
    const teacher = this.teachers.find(t => t.id === id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  create(createTeacherDto: CreateTeacherDto): Teacher {
    const newTeacher = {
      id: this.teachers.length > 0 ? Math.max(...this.teachers.map(t => t.id)) + 1 : 1,
      ...createTeacherDto,
    };
    this.teachers.push(newTeacher);
    return newTeacher;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto): Teacher {
    const teacherIndex = this.teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    this.teachers[teacherIndex] = {
      ...this.teachers[teacherIndex],
      ...updateTeacherDto,
    };

    return this.teachers[teacherIndex];
  }

  remove(id: number) {
    const teacherIndex = this.teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    
    this.teachers.splice(teacherIndex, 1);
    
    return { message: `Teacher with ID ${id} deleted successfully` }; 
  }
  

  getHighestSalaryTeacher(): Teacher {
    if (this.teachers.length === 0) {
      throw new NotFoundException('No teachers available');
    }
    return this.teachers.reduce((max, teacher) => 
      teacher.salary > max.salary ? teacher : max
    );
  }
}