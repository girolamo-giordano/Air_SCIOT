# PurAir: Serverless Computing For IoT Project

## Introduction

The idea is to simulate an environment which an IoT sensor tracks the air quality of a given room, and send an allert to the user when the value of air's quality is low. The user can decide to start the air purifier to improve the air quality. All the sensors are simulated.

## Architecture

One of the phases is to simulate the IoT sensor regarding the quality air, the values can be sent in two ways:

- Using the function
- Using an MQTT client from your smartphone:
    
    - EasyMQTT for IOS
    - MQTT for Android

The value is an integer between 0 to 100 and indicate the percentage of air quality. This value is published to the Topic <strong>"iot/sensors/air"</strong> of RabbitMQ. At this point a Nuclio function is triggered: <strong>consumeair</strong>. This function process and check its value. If the value is < 50 it sent the value to the RabbitMQ queue <strong>"iot/sensors/alarm"</strong> and also to the RabbitMQ queue <strong>"iot/sensors/log"</strong>. If the value is >= 50 the value is sent only to RabbitMQ queue <strong>"iot/sensors/log"</strong>. At this point in the Telegram bot the message in the <strong>"iot/sensors/alarm"</strong> is intercepted and the message is sent to the user. The user can choose to start purificator air, and if it's do this, a message that represent the status of the purificator air will go to the RabbitMQ queue <strong>"iot/sensors/purair"</strong>. From this queue is possible to get the message that inform the status of purificator air. 

![Architecture](https://github.com/girolamo-giordano/telegrambot/blob/main/img/iot_diagram.png?raw=true)

## Project structure
- **src/**
  - **bot.js**: allows you to start the bot and communicate with the user
  - **status_air.js**: keeps track the status of the air purifier
  - **logger.js**: keeps track all the messages about air and its status
- **yaml_functions/**
  - **sendrandomair.yaml**: send random value to the Topic "iot/sensors/air"
  - **consumeair.yaml**: takes care of processing received values and send it to the user or log 
- **.env**: file containing settings for javascript scripts
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
  - Copy and paste the **Token** that BotFather gave you in the **BOT_TOKEN** in [.env](.env) file;

- **Install all dependencies, start Telegram bot's server, AirStatus client and Logger**

  - Open again .env file and insert your IP address instead of **'INSERT_YOUR_IP'** in the field **IP**.
  - Install requirements:
   ```sh
    npm install amqplib
    npm install dotenv
   ```
  - Open three terminals and type on the first:
  ```sh
    node bot.js
   ```
  - on the second:
  ```sh
    node status_air.js
   ```
  - on the last one:
   ```sh
    node logger.js
   ```
- **Now we can use the Telegram client**
  - Open Telegram
  - Run bot using **/start**

After all this steps, you can use the **sendrandomair** function on Nuclio or **MQTT client** from your smartphone. If the value is < 50, you will be notified on the bot and asked to make a decision.

## Demo


https://user-images.githubusercontent.com/56109364/132731147-0ff91588-aef9-472a-8122-f838dd7d9059.mp4



  
