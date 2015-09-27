# ninjablock-bridge
Now that Ninja Blocks is no more this project will enable you to utilise the Ninja Block to bridge RF433 messages to another system using webhooks and socket.io.

## How Does It Work

Pretty simlple actually. The Ninja Cape publishes messages to the Beagleboard over serial.

This module listens for messages over the serial interface and republishes them to registered webhooks and connected socket.io clients.

## Example Messages

```
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

I had to upgrade Node.js on my Ninja Block to 0.12.x. The installed version was 0.8.x.
