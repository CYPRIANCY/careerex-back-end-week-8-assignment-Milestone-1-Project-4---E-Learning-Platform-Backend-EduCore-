import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load notifications', error });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findOne({ _id: notificationId, user: req.user.id });
    if (!notification) return res.status(404).json({ message: 'Not found' });

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update', error });
  }
};

export const createNotification = async (userId, message, link = '') => {
  try {
    const notification = new Notification({ user: userId, message, link });
    await notification.save();
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};
