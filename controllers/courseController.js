import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const newCourse = await Course.create({
      title,
      description,
      category,
      instructor: req.user.id,
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Course creation failed', error });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Fetching courses failed', error });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Fetching instructor courses failed', error });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to update this course' });

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Updating course failed', error });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to delete this course' });

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deleting course failed', error });
  }
};
