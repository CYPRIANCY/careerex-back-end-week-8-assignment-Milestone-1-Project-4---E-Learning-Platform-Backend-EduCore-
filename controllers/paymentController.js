import paypal from '@paypal/checkout-server-sdk';
import client from '../config/paypal.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const createOrder = async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: course.price.toFixed(2),
        },
        description: `Purchase of course: ${course.title}`,
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    res.status(500).json({ message: 'Payment creation failed', error: err });
  }
};

export const captureOrder = async (req, res) => {
  const { orderID, courseId } = req.body;
  const studentId = req.user.id;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = await Enrollment.findOne({ student: studentId, course: courseId });
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = new Enrollment({ student: studentId, course: courseId });
    await enrollment.save();

    res.json({ message: 'Payment successful and enrolled', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Payment capture failed', error });
  }
};
