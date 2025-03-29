export class CreateTeacherDto {
    name: string;
    age: number;
    salary: number;
  }
  
  export class UpdateTeacherDto {
    name?: string;
    age?: number;
    salary?: number;
  }

  export interface Teacher {
    id: number;
    name: string;
    age: number;
    salary: number;
  }