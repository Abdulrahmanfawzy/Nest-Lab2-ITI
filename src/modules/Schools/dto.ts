export class CreateSchoolDto {
    name: string;
  }
  
  export class UpdateSchoolDto {
    name?: string;
  }

  export interface School {
    id: number;
    name: string;
    teacherIds: number[];
  }