import Progress from '../models/Progress.js';
import Lesson from "../models/Lesson.js";

export const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const studentId = req.user.id;

  try {
    let progress = await Progress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      progress = new Progress({ student: studentId, course: courseId, completedLessons: [lessonId] });
    } else if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    await progress.save();
    res.status(200).json({ message: 'Lesson marked complete', progress });
  } catch (error) {
    res.status(500).json({ message: 'Could not update progress', error });
  }
};

export const getProgressByCourse = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const progress = await Progress.findOne({ student: studentId, course: courseId }).populate('completedLessons');
    res.json(progress || { completedLessons: [] });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch progress', error });
  }
};
