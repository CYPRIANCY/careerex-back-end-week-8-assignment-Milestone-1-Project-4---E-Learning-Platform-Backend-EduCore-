import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { deleteNotification } from './notificationController.js';
import sendNotification from '../utils/sendNotification.js';

export const enrollInCourse = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
    await sendNotification(studentId, `You've successfully enrolled in ${course.title}`, 'success');
    
    // After successful enrollment
    await deleteNotification(course.instructor, `${user.name} enrolled in your course: ${course.title}`, `/courses/${courseId}`);
    await deleteNotification(user._id, `You successfully enrolled in ${course.title}`, `/courses/${courseId}`);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    res.status(500).json({ message: 'Enrollment failed', error });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch enrollments', error });
  }
};

export const getCourseEnrollments = async (req, res) => {
  const instructorId = req.user.id;
  const { courseId } = req.params;

  try {
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) return res.status(403).json({ message: 'Access denied' });

    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch course enrollments', error });
  }
};
