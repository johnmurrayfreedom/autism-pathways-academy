import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  order: number;
  module_id: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  course_id: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category_id: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  image_url?: string;
  estimated_time: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  modules: Module[];
}

export interface CourseProgress {
  course_id: number;
  completed_lessons: number[];
  last_accessed: string;
}

export interface CourseFilter {
  category_id?: number;
  skip?: number;
  limit?: number;
}

class CourseService {
  private static instance: CourseService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1`;
  }

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  /**
   * Get all categories
   */
  async getCategories(skip: number = 0, limit: number = 10): Promise<Category[]> {
    const response = await axios.get(`${this.baseUrl}/courses/categories`, {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get all courses, optionally filtered
   */
  async getCourses(categoryId?: number, skip: number = 0, limit: number = 10): Promise<Course[]> {
    const response = await axios.get(`${this.baseUrl}/courses`, {
      params: { category_id: categoryId, skip, limit },
    });
    return response.data;
  }

  /**
   * Get a single course by ID
   */
  async getCourse(courseId: number): Promise<Course> {
    const response = await axios.get(`${this.baseUrl}/courses/${courseId}`);
    return response.data;
  }

  /**
   * Start a course
   */
  async startCourse(courseId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/courses/${courseId}/start`);
  }

  /**
   * Complete a lesson
   */
  async completeLesson(lessonId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/courses/lessons/${lessonId}/complete`);
  }

  /**
   * Get course progress for current user
   */
  async getCourseProgress(courseId: number): Promise<CourseProgress> {
    const response = await axios.get(`${this.baseUrl}/courses/${courseId}/progress`);
    return response.data;
  }

  async getLesson(lessonId: number): Promise<Lesson> {
    const response = await axios.get(`${this.baseUrl}/courses/lessons/${lessonId}`);
    return response.data;
  }
}

export default CourseService.getInstance(); 