'use strict'

const azure = require('azure')
const iothub = require('azure-iothub')
const clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
const Message = require('azure-iot-device').Message;
const iothubConnectionString = `${yourIotHubConnectionString}`

let registry = iothub.Registry.fromConnectionString(iothubConnectionString);
let serviceBusService = azure.createServiceBusService(`${yourServiceBusConnectionString}`)

let mode = process.argv[2]
console.log('Mode: ', mode)

let sendMessage = (deviceId, deviceKey) => {
    let connectionString = `${yourDeviceConnectionString}`
    let client = clientFromConnectionString(connectionString)

    let printResultFor = (op) => {
        return function printResult(err, res) {
          if (err) console.log(op + ' error: ' + err.toString())
          if (res) console.log(op + ' status: ' + res.constructor.name)
        }
      }

    let connectCallback = (err) => {
        if (err) {
          console.log('Could not connect: ' + err)
        } else {
          console.log('Client connected')
      
          // Create a message and send it to the IoT Hub every second
          setInterval(function(){
              var temperature = 20 + (Math.random() * 15)
              var humidity = 60 + (Math.random() * 20)
              var data = JSON.stringify({ deviceId: deviceId, temperature: temperature, humidity: humidity })
              var message = new Message(data)
              message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false')
              console.log("Sending message: " + message.getData())
              client.sendEvent(message, printResultFor('send'))
          }, 1000)
        }
      }
    
    client.open(connectCallback)
}

let registerDevice = () => {
    let device = {
        deviceId: 'myFirstNodeDevice'
    }
    registry.create(device, (err, deviceInfo, res) => {
        let devicePrintCallback = (err, deviceInfo, res) => {
            if (deviceInfo) {
              console.log('Device ID: ' + deviceInfo.deviceId);
              console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);

              sendMessage(deviceInfo.deviceId, deviceInfo.authentication.symmetricKey.primaryKey)
            }
        }

        if (err) {
            registry.get(device.deviceId, devicePrintCallback);
        }
        if (deviceInfo) {
            devicePrintCallback(err, deviceInfo, res)
        }
    })
}

if(mode == "" || mode == null || mode == 'topic') {
    let message = {
        "body": JSON.stringify({
            "temp": 18
        })
    }

    serviceBusService.sendTopicMessage(`${yourTopic}`, message, (error) => {
        if (error) {
        console.log(error);
        }
        console.log('message sent: ', message)
    })
}

if(mode == 'iothub') {
    registerDevice()
}
