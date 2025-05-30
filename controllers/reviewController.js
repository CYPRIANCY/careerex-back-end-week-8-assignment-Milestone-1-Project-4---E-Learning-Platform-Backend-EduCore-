import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

export const createReview = async (req, res) => {
  const studentId = req.user.id;
  const { courseId, rating, comment } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() === studentId)
      return res.status(403).json({ message: 'Instructors cannot review their own course' });

    const enrolled = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrolled) return res.status(403).json({ message: 'You must enroll to review' });

    const review = await Review.create({
      student: studentId,
      course: courseId,
      rating,
      comment,
    });

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this course' });
    }
    res.status(500).json({ message: 'Failed to add review', error });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId }).populate('student', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};
