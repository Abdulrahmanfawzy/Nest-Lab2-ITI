import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  private readonly teacher_data = [
    { id: 1, name: 'Adham', age: 22, grade: 40 },
    { id: 2, name: 'Zyad', age: 33, grade: 50 },
    { id: 3, name: 'Galal', age: 22, grade: 70 },
    { id: 4, name: 'Ali', age: 15, grade: 60 },
    { id: 5, name: 'Mona', age: 25, grade: 20 },
  ];

  private readonly school_data = [
    { id: 1, name: 'Primary School', teachers: [1, 2, 3] },
    { id: 2, name: 'High School', teachers: [4, 5] },
    { id: 3, name: 'International School', teachers: [] },
  ];

  // Teacher CRUD operations
  getAllTeachers() {
    return this.teacher_data;
  }

  getOneTeacher(id: number) {
    const teacher = this.teacher_data.find((t) => t.id === id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  addTeacher(dto: TeacherDto) {
    const id = this.teacher_data[this.teacher_data.length - 1].id + 1;
    const teacher = {
      id,
      ...dto,
    };

    this.teacher_data.push(teacher);
    return teacher;
  }

  updateTeacher(dto: Partial<TeacherDto>, id: number) {
    const teacherIndex = this.teacher_data.findIndex((t) => t.id === id);
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    this.teacher_data[teacherIndex] = {
      ...this.teacher_data[teacherIndex],
      ...dto,
    };

    return this.teacher_data[teacherIndex];
  }

  deleteTeacher(id: number) {
    const teacherIndex = this.teacher_data.findIndex((t) => t.id === id);
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Remove teacher from any schools they're assigned to
    this.school_data.forEach(school => {
      const teacherInSchoolIndex = school.teachers.indexOf(id);
      if (teacherInSchoolIndex !== -1) {
        school.teachers.splice(teacherInSchoolIndex, 1);
      }
    });

    this.teacher_data.splice(teacherIndex, 1);
    return { message: `Teacher with ID ${id} deleted successfully` };
  }

  highestGradeTeacher() {
    return this.teacher_data.reduce((max, teacher) =>
      teacher.grade > max.grade ? teacher : max
    );
  }

  // School CRUD operations
  getAllSchools() {
    return this.school_data;
  }

  getOneSchool(id: number) {
    const school = this.school_data.find((s) => s.id === id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  addSchool(dto: SchoolDto) {
    const id = this.school_data[this.school_data.length - 1].id + 1;
    const school = {
      id,
      name: dto.name,
      teachers: [],
    };

    this.school_data.push(school);
    return school;
  }

  updateSchool(dto: Partial<SchoolDto>, id: number) {
    const schoolIndex = this.school_data.findIndex((s) => s.id === id);
    if (schoolIndex === -1) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    this.school_data[schoolIndex] = {
      ...this.school_data[schoolIndex],
      ...dto,
    };

    return this.school_data[schoolIndex];
  }

  deleteSchool(id: number) {
    const schoolIndex = this.school_data.findIndex((s) => s.id === id);
    if (schoolIndex === -1) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    this.school_data.splice(schoolIndex, 1);
    return { message: `School with ID ${id} deleted successfully` };
  }

  assignTeacherToSchool(schoolId: number, teacherId: number) {
    const school = this.school_data.find((s) => s.id === schoolId);
    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }

    const teacher = this.teacher_data.find((t) => t.id === teacherId);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    if (!school.teachers.includes(teacherId)) {
      school.teachers.push(teacherId);
    }

    return school;
  }

  removeTeacherFromSchool(schoolId: number, teacherId: number) {
    const school = this.school_data.find((s) => s.id === schoolId);
    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }

    const teacherIndex = school.teachers.indexOf(teacherId);
    if (teacherIndex !== -1) {
      school.teachers.splice(teacherIndex, 1);
    }

    return school;
  }

  getSchoolAnalytics() {
    if (this.school_data.length === 0) {
      return { message: "No schools available" };
    }

    const schoolsWithTeacherCount = this.school_data.map(school => ({
      ...school,
      teacherCount: school.teachers.length
    }));

    const mostTeachersSchool = schoolsWithTeacherCount.reduce((max, school) =>
      school.teacherCount > max.teacherCount ? school : max
    );

    const leastTeachersSchool = schoolsWithTeacherCount.reduce((min, school) =>
      school.teacherCount < min.teacherCount ? school : min
    );

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
      }
    };
  }
}

interface TeacherDto {
  name: string;
  age: number;
  grade: number;
}

interface SchoolDto {
  name: string;
}