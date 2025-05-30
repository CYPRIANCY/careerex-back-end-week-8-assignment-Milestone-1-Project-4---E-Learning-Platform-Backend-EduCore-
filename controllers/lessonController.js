
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

export const addLesson = async (req, res) => {
  const { courseId, title, content, videoUrl, order } = req.body;

  try {
    const course = await Course.findOne({ _id: courseId, instructor: req.user.id });
    if (!course) return res.status(403).json({ message: 'Access denied' });

    const newLesson = await lesson.create({
      course: courseId,
      title,
      content,
      videoUrl,
      order,
    });

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: 'Lesson creation failed', error });
  }
};

export const getCourseLessons = async (req, res) => {
  const { courseId } = req.params;

  try {
    const lessons = await Lesson.find({ course: courseId }).sort('order');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lessons', error });
  }
};

export const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { title, content, videoUrl, order } = req.body;

  try {
    const lesson = await Lesson.findById(lessonId).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (lesson.course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to update this lesson' });

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.order = order ?? lesson.order;

    const updated = await lesson.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lesson update failed', error });
  }
};

export const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (lesson.course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to delete this lesson' });

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Lesson deletion failed', error });
  }
};
