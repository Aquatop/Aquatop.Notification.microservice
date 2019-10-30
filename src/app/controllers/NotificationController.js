import Notification from '../schemas/Notification';

class NotificationController {
  async store(req) {
    const newNotification = await Notification.create({
      ...req,
      aquariumName: req.aquarium,
    });

    return { newNotification, result: 'Notification created!' };
  }

  async update(req, res) {
    const { _id } = req.params;

    const notification = await Notification.findById(_id);

    if (notification) {
      notification.read = true;

      await notification.save();
      return res.status(200).json({ result: 'Notification set to read!' });
    }

    return res.status(400).json({ result: 'Notification was not updated!' });
  }

  async list(req, res) {
    const { aquariumName } = req.params;

    const notifications = await Notification.find({ aquariumName });

    if (!notifications) {
      return res.json({ result: [] });
    }

    return res.json({ result: notifications });
  }
}

export default new NotificationController();
