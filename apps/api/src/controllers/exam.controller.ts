import { Request, Response } from 'express';
import { Resource } from '../models/Resource.js';
import { Course } from '../models/Course.js';

export const getExamEmergencyData = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate('departmentId', 'name code');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const resources = await Resource.find({
      courseId,
      status: 'PUBLISHED',
    }).sort({ qualityScore: -1, 'stats.downloadsCount': -1 });

    // Group resources into signature Exam Emergency Room categories
    const previousQuestions = resources.filter((r) => r.resourceType === 'Previous Exam Questions');
    const solvedQuestions = resources.filter((r) => r.resourceType === 'Solved Questions');
    const cheatSheets = resources.filter((r) => r.resourceType === 'Cheat Sheets');
    const highYieldNotes = resources.filter((r) => r.resourceType === 'Lecture Notes' || r.resourceType === 'Class Notes');

    // Aggregate topic frequency signals from published resources
    const topicCounts: Record<string, number> = {};
    resources.forEach((r) => {
      r.topics.forEach((t) => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    });

    const frequentTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Exam Emergency Room telemetry loaded.',
      data: {
        course,
        stats: {
          totalEmergencyResources: resources.length,
          pantryHealthScore: course.pantryHealthScore,
        },
        sections: {
          previousQuestions,
          solvedQuestions,
          cheatSheets,
          highYieldNotes,
        },
        frequentTopics,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
