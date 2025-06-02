import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user.id;

  const conversationId = [senderId, receiverId].sort().join('_');

  try {
    const message = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
    });
    await message.save();
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

export const getConversation = async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.params;

  const conversationId = [userId, partnerId].sort().join('_');

  try {
    const messages = await Message.find({ conversationId }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load messages', error });
  }
};

export const getInbox = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ updatedAt: -1 });

    const inboxMap = new Map();

    messages.forEach((msg) => {
      const partnerId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
      const key = [userId, partnerId].sort().join('_');
      if (!inboxMap.has(key)) inboxMap.set(key, msg);
    });

    const inbox = Array.from(inboxMap.values());
    res.json(inbox);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load inbox', error });
  }
};
