import { Request, Response } from 'express';
import { University } from '../models/University';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Teacher } from '../models/Teacher';

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const list = await University.find().sort({ name: 1 });
    return res.status(200).json({ success: true, statusCode: 200, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const { universityId } = req.query;
    const filter = universityId ? { universityId } : {};
    const list = await Department.find(filter).populate('universityId', 'name code').sort({ name: 1 });
    return res.status(200).json({ success: true, statusCode: 200, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.query;
    const filter = departmentId ? { departmentId } : {};
    const list = await Course.find(filter).populate('departmentId', 'name code').sort({ code: 1 });
    return res.status(200).json({ success: true, statusCode: 200, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.query;
    const filter = departmentId ? { departmentId } : {};
    const list = await Teacher.find(filter).populate('departmentId', 'name code').sort({ name: 1 });
    return res.status(200).json({ success: true, statusCode: 200, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
