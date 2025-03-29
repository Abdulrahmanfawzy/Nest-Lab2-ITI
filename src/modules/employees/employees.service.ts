import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './employee.dto';

@Injectable()
export class EmployeesService {
  private employees = [
    { id: 1, name: 'Adham Galal', age: 30, salary: 5000 },
    { id: 2, name: 'Youssef Galal', age: 20, salary: 6000 },
    { id: 3, name: 'Zyad Galal', age: 10, salary: 7000 },
  ];

  findAll() {
    return this.employees;
  }

  findOne(id: number) {
    const employee = this.employees.find(emp => emp.id === id);
    if (!employee) throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = { id: Date.now(), ...createEmployeeDto };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  update(id: number, updateEmployeeDto: Partial<CreateEmployeeDto>) {
    const employee = this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return employee;
  }

  delete(id: number) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new NotFoundException(`Employee with ID ${id} not found`);
    this.employees.splice(index, 1);
    return { message: `Employee with ID ${id} deleted successfully` };
  }

findHighestSalary() {
  return this.employees.reduce((max, employee) => 
    employee.salary > max.salary ? employee : max
  );
}
}
