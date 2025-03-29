import { Injectable, NotFoundException } from '@nestjs/common';
import { School, CreateSchoolDto, UpdateSchoolDto } from './dto';
import { TeachersService } from '../Teachers/teachers.service';

@Injectable()
export class SchoolsService {
  private schools: School[] = [
    { id: 1, name: 'ALS', teacherIds: [1, 2, ] },
    { id: 2, name: 'AHmed Oraby', teacherIds: [3, 4] },
    { id: 3, name: 'High Shool', teacherIds: [5] },
    { id: 4, name: 'International School', teacherIds: [] }
  ];

  constructor(private readonly teachersService: TeachersService) {}

  findAll(): School[] {
    return this.schools;
  }

  findOne(id: number): School {
    const school = this.schools.find(s => s.id === id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  create(createSchoolDto: CreateSchoolDto): School {
    const newSchool = {
      id: this.schools.length > 0 ? Math.max(...this.schools.map(s => s.id)) + 1 : 1,
      name: createSchoolDto.name,
      teacherIds: [],
    };
    this.schools.push(newSchool);
    return newSchool;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto): School {
    const schoolIndex = this.schools.findIndex(s => s.id === id);
    if (schoolIndex === -1) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    this.schools[schoolIndex] = {
      ...this.schools[schoolIndex],
      ...updateSchoolDto,
    };

    return this.schools[schoolIndex];
  }

  remove(id: number): void {
    const schoolIndex = this.schools.findIndex(s => s.id === id);
    if (schoolIndex === -1) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    this.schools.splice(schoolIndex, 1);
  }

  getAnalytics() {
    console.log('Current schools data:', this.schools); 
    if (!this.schools || this.schools.length === 0) {
      throw new NotFoundException('No schools available');
    }

    // Validate school data first
    this.schools.forEach(school => {
      if (typeof school.id !== 'number' || isNaN(school.id)) {
        throw new Error(`Invalid school ID: ${school.id}`);
      }
      if (!Array.isArray(school.teacherIds)) {
        throw new Error(`Invalid teacherIds for school ${school.id}`);
      }
    });

    const schoolsWithTeacherCount = this.schools.map(school => ({
      ...school,
      teacherCount: school.teacherIds.length
    }));

    // Initialize with first school
    let mostTeachersSchool = schoolsWithTeacherCount[0];
    let leastTeachersSchool = schoolsWithTeacherCount[0];

    // Find schools with most and least teachers
    for (const school of schoolsWithTeacherCount) {
      if (school.teacherCount > mostTeachersSchool.teacherCount) {
        mostTeachersSchool = school;
      }
      if (school.teacherCount < leastTeachersSchool.teacherCount) {
        leastTeachersSchool = school;
      }
    }

    return {
      mostTeachers: {
        schoolId: mostTeachersSchool.id,
        schoolName: mostTeachersSchool.name,
        teacherCount: mostTeachersSchool.teacherCount
      },
      leastTeachers: {
        schoolId: leastTeachersSchool.id,
        schoolName: leastTeachersSchool.name,
        teacherCount: leastTeachersSchool.teacherCount
      },
      totalSchools: this.schools.length,
      averageTeachers: parseFloat(
        (schoolsWithTeacherCount.reduce((sum, school) => sum + school.teacherCount, 0) / 
        this.schools.length
      ).toFixed(2))
    };
  }
}

