import { Kafka, logLevel } from 'kafkajs';

import NotificationController from '../app/controllers/NotificationController';

class Communication {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'notification',
      brokers: [process.env.KAFKA_URL],
      logLevel: logLevel.WARN,
    });

    this.schedulingConsumer = this.kafka.consumer({
      groupId: 'scheduling-notification-group',
    });

    this.runSchedulingConsumer();
    // this.runWebSocketConsumer();
  }

  async runSchedulingConsumer() {
    await this.schedulingConsumer.connect();

    await this.schedulingConsumer.subscribe({
      topic: 'scheduling-notification',
    });

    await this.schedulingConsumer.run({
      eachMessage: async ({ message }) => {
        console.log('Response: ', String(message.value));

        const payload = JSON.parse(message.value);
        const { type } = payload;

        let response = '';
        const notification = payload;

        switch (type) {
          case 'NOTIFY_TO_VERIFY_FILTER':
            notification.title = 'Verique seu filtro!';
            notification.description = 'O seu filtro pode estar sujo, limpe-o!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TO_VERIFY_FOOD':
            notification.title = 'Verique seu compartimento de raçao!';
            notification.description =
              'O seus peixes podem estar ficando sem comida, da uma olhada lá se tem ração!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TO_SWAP_WATER':
            notification.title = 'Lembre-se da troca de agua!';
            notification.description =
              'Chegou o dia! Troque a aqua de seu aquario para garantir um ambiente agradavél para seus peixes!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_FISH_FEED_REQUEST':
            notification.title = 'Requisitamos a alimentação do seus peixes!';
            notification.description =
              'Se tudo deu certo seus peixes estão de buxo cheio!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TURN_ON_LIGHTS_REQUEST':
            notification.title = 'Requisitamos as luzes sejam ligadas!';
            notification.description =
              'Se deu tudo certo as luzes estão ligadas';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TURN_OFF_LIGHTS_REQUEST':
            notification.title = 'Requisitamos as luzes sejam desligadas!';
            notification.description =
              'Se deu tudo certo as luzes estão desligadas';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          default:
            console.log(`Message type ${type} is invalid!`);
            break;
        }
      },
    });
  }

  // async runWebSocketConsumer() {
  //   await this.webSocketConsumer.connect();

  //   await this.webSocketConsumer.subscribe({
  //     topic: 'webSocket-notification',
  //   });

  //   await this.webSocketConsumer.run({
  //     eachMessage: async ({ message }) => {
  //       console.log('Response: ', String(message.value));

  //       const payload = JSON.parse(message.value);
  //       const { type } = payload;

  //       // const response = '';
  //       // const notification = payload;

  //       switch (type) {
  //         default:
  //           console.log(`Message type ${type} is invalid!`);
  //           break;
  //       }
  //     },
  //   });
  // }
}

export default new Communication();
