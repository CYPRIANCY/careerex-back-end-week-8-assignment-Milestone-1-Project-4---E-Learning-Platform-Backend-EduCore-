import Notification from '../models/Notification.js';

const sendNotification = async (userId, message, type = 'info') => {
  try {
    const notification = new Notification({ user: userId, message, type });
    await notification.save();
  } catch (error) {
    console.error('Notification error:', error);
  }
};

export default sendNotification;
