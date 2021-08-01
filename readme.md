# PurAir: Serverless Computing For IoT Project

## Introduction

The idea is to simulate an environment which an IoT sensor tracks the air quality of a given room, and send an allert to the user when the value of air's quality is low. The user can decide to start the air purifier to improve the air quality. All the sensors are simulated.

## Architecture

One of the phase is to simulate the IoT sensor regarding the quality air, the values can be sent in two ways:

- Using the function
- Using an MQTT client from your smartphone:
    
    - EasyMQTT
    - MQTT for Android

The value is an integer between 0 to 100 and indicate the percentage of air quality. This value is published to the Topic "iot/sensors/air of RabbitMQ. At this point a Nuclio function is triggered: consumeair. This function process and check its value. If the value is < 50 it sent the value to the RabbitMQ queue "iot/sensors/alarm" and also to the RabbitMQ queue "iot/sensors/log". If the value is >= 50 the value is sent only to RabbitMQ queue "iot/sensors/log". At this point in the Telegram bot the message in the "iot/sensors/alarm" is intercepted and the message is sento to the user. The user can choose to start purificator air, and if it's do this, a message will go to the RabbitMQ queue "iot/sensors/purair". 

## Getting started

 > NB: it's required Node.js and Docker to run.

From two different terminals start the docker to run RabbitMQ and Nuclio with these following commands:

- **Docker RabbitMQ**:

  ```sh
  docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt
  ```

- **Docker Nuclio**:

  ```sh
  docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
  ```

- **Update and deploy functions**:
 1. Type '**localhost:8070**' on your browser to open the homepage of Nuclio;
2.  Create new project and call it **PurAir**;
  3. Press '**Create function**', '**Import**' and upload the two functions that are in the **yaml_functions** folder;
  4. In both, **change the already present IP with your IP**; also in the tab regarding the trigger
  5. Press **'Deploy'**.

- **Create personal Telegram Bot**:

  - Open Telegram and search for [BotFather](https://t.me/BotFather).
  - Press **start** and type **/newbot**.
  - Give it a **name** and a **unique id**, follow the instructions gived by BotFather.
  - Copy and paste the **Token** that BotFather gave you in the **Telegraf constructor** in [.env](.env) file;
