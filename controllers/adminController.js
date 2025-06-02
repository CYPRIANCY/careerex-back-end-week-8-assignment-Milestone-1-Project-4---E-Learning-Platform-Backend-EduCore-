import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import mongoose from 'mongoose';

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch users', error });
//   }
// };

// export const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().populate('instructor', 'name email');
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch courses', error });
//   }
// };

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const popularCourses = await Enrollment.aggregate([
      { $group: { _id: '$course', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      { $unwind: '$courseDetails' },
      {
        $project: {
          title: '$courseDetails.title',
          enrollments: 1,
        },
      },
    ]);

    const recentSignups = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      roleCounts,
      totalCourses,
      totalEnrollments,
      popularCourses,
      recentSignups,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error });
  }
};