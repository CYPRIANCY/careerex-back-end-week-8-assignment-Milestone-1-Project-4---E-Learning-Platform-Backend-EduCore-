import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import path from 'path';

export const generateCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (!enrollment || !enrollment.completed)
      return res.status(400).json({ message: 'Course not completed yet' });

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    const doc = new PDFDocument();
    const filename = `${course.title}_certificate_${user.name}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc
      .fontSize(24)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown()
      .fontSize(18)
      .text(`${user.name}`, { align: 'center' })
      .moveDown()
      .fontSize(14)
      .text(`has successfully completed the course`, { align: 'center' })
      .text(`"${course.title}"`, { align: 'center' })
      .moveDown()
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' })
      .end();

    doc.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate certificate', error });
  }
};

export const markCourseCompleted = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.completed = true;
    enrollment.completedAt = new Date();
    await enrollment.save();

    res.json({ message: 'Course marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update completion', error });
  }
};
