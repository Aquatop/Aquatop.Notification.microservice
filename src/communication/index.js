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
            notification.title = 'Verificação de filtro';
            notification.description = 'O seu filtro pode estar sujo, confira e, se necessário, realize a limpeza!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TO_VERIFY_FOOD':
            notification.title = 'Verificação de ração';
            notification.description =
              'Seus compartimentos podem estar sem comida, dê uma olhada!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TO_SWAP_WATER':
            notification.title = 'Dia de troca de água';
            notification.description =
              'É agora! A água do seu aquário será trocada!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_FISH_FEED_REQUEST':
            notification.title = 'Alimentação dos peixes';
            notification.description =
              'Seus peixes serão alimentados agora!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TURN_ON_LIGHTS_REQUEST':
            notification.title = 'Acendimento das luzes';
            notification.description =
              'Se deu tudo certo, as luzes estão ligadas!';

            response = await NotificationController.store(notification);
            console.log(response);
            break;
          case 'NOTIFY_TURN_OFF_LIGHTS_REQUEST':
            notification.title = 'Desligamento das luzes';
            notification.description =
              'Se deu tudo certo, as luzes estão desligadas!';

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
