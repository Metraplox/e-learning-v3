import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateCourseInput} from './dto/inputs/create-course.input';
import {UpdateCourseInput} from './dto/inputs/update-course.input';
import {Course} from './entities/course.entity';

@Injectable()
export class CoursesService {

    private courses: Course[] = [
        {
        id: '1',
        name: 'Course 1',
        description: 'Description of course 1',
        teacher: 'Teacher 1',
        duration: 10,
        price: 100,
        },
        {
        id: '2',
        name: 'Course 2',
        description: 'Description of course 2',
        teacher: 'Teacher 2',
        duration: 20,
        price: 200,
        },
        {
        id: '3',
        name: 'Course 3',
        description: 'Description of course 3',
        teacher: 'Teacher 3',
        duration: 30,
        price: 300,
        }
    ];

  create(createCourseInput: CreateCourseInput) {

    const courses = new Course();
    courses.id = createCourseInput.id;
    courses.name = createCourseInput.name;

    this.courses.push(courses);

    return courses;
  }

  findAll() {
    return this.courses;
  }

    findOne(id: string): Course {
    const course =  this.courses.find(course => course.id === id);

    if(!course) throw new NotFoundException(`Course with id ${id} not found`);

    return course;
  }

  update( updateCourseInput: UpdateCourseInput) {

    const { id, name, description, teacher, duration, price, category, image, video } = updateCourseInput;
    const courseToUpdate = this.findOne(id);

    if(name) courseToUpdate.name = name;
    if(description) courseToUpdate.description = description;
    if(teacher) courseToUpdate.teacher = teacher;
    if(duration) courseToUpdate.duration = duration;
    if(price) courseToUpdate.price = price;


    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
