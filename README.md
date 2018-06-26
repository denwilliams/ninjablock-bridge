# ninjablock-bridge

> Deprecated - no longer maintained since I now use a Sonoff RFBridge with custom firmware (Espurna) to achieve essentially the same thing in a more lightweight package. This now serves no purpose.

Now that Ninja Blocks is no more this project will enable you to utilise the Ninja Block to bridge RF433 messages to another system using Socket.IO, MQTT, and webhooks (TBD).

## How Does It Work

Pretty simple actually. The Ninja Cape publishes messages to the Beagleboard over serial.

This module listens for messages over the serial interface and, parses them, then republishes them to registered webhooks and connected socket.io clients (webhooks coming soon).

## Example Socket.IO Events

Some example events published over socket.io 

```js
// Nina eyes and light
{ event: '0_0_1007.eyes',
  device: '0_0_1007',
  type: 'eyes',
  data: '000000' }
{ event: '0_0_999.statuslight',
  device: '0_0_999',
  type: 'statuslight',
  data: '0000FF' }

// Temp sensor
{ event: '0201_0_30.humidity',
  device: '0201_0_30',
  type: 'humidity',
  data: 67 }
{ event: '0201_0_31.temperature',
  device: '0201_0_31',
  type: 'temperature',
  data: 18.5 }

// RF sensor
{ event: '0_0_11.rfsensor',
  device: '0_0_11',
  deviceName: 'hallway',
  type: 'rfsensor',
  data: '010101011111011101011100' }
```

## Example Source Serial Messages

The source data coming over the serial interface looks something like:

```json
{"DEVICE":[{"G":"0","V":0,"D":11,"DA":"010101011111011101011100"}]}
{"DEVICE":[{"G":"0","V":0,"D":11,"DA":"010101011111011101011100"}]}
{"DEVICE":[{"G":"0","V":0,"D":11,"DA":"010101011111011101011100"}]}
{"DEVICE":[{"G":"0","V":0,"D":1007,"DA":"000000"}]}
{"DEVICE":[{"G":"0","V":0,"D":999,"DA":"00FF00"}]}
{"DEVICE":[{"G":"0201","V":0,"D":30,"DA":64}]}
{"DEVICE":[{"G":"0201","V":0,"D":31,"DA":15.80000}]}
{"DEVICE":[{"G":"0","V":0,"D":1007,"DA":"000000"}]}
{"DEVICE":[{"G":"0","V":0,"D":999,"DA":"00FF00"}]}
{"DEVICE":[{"G":"0","V":0,"D":1007,"DA":"000000"}]}
{"DEVICE":[{"G":"0","V":0,"D":999,"DA":"00FF00"}]}
{"DEVICE":[{"G":"0201","V":0,"D":30,"DA":64}]}
```

From `http://docs.ninja.is/core-concepts.html`:

```
GUID - the device's globally unique ID.
DA - the data value being reported by the device
D - the device ID, unique within a manufacturer's devices.
V - the vendor ID of the device, unique to the manufacturer.
G - a number corresponding to the port that the device is attached to.
```

## Notes

### Node JS

I had to upgrade Node.js on my Ninja Block to 0.12.x. The installed version was 0.8.x.

## Beagleboard Black

I've had a lot more success since I blew away the original operating system install and just started with an image from https://beagleboard.org/latest-images.

To enable WiFi: https://www.digikey.com/en/maker/blogs/how-to-setup-wifi-on-the-beaglebone-black-wireless/f6452fa17bd24347a59f306355ebfef8

I had to `sudo nano /etc/connman/main.conf` then replace

```
[General]
PreferredTechnologies=ethernet,wifi
```

with

```
[General]
PreferredTechnologies=wifi,ethernet
```

And to enable the cape, edited `/boot/uEnv.txt` and added the line:

```
cape_enable=bone_capemgr.enable_partno=BB-UART1
```

Another suggestion to improve WiFi is to disable HDMI:

```
cape_disable=bone_capemgr.disable_partno=BB-BONELT-HDMI,BB-BONELT-HDMIN
```
