# tplink-ifttt-rig-notification

This node.js monitors the power usage of a TP-Link HS110 smart plug to determine when the device uses less power than it shuld use, and it will notify you on IFTTT mobile app.

![TP-Link HS110 Smart Plug](https://cloud.githubusercontent.com/assets/4665046/18059321/7974aba2-6de6-11e6-8acf-46f04b2fa43c.jpg)
![IFTTT Notification](https://cloud.githubusercontent.com/assets/4665046/18059320/7974923e-6de6-11e6-9271-22c954b55671.JPG)

## Installing
```
npm install iftttmaker 
npm install --save tplink-cloud-api
```



## Instructions for Settings up an IFTTT recipe

### Connect the Maker channel
https://ifttt.com/maker_webhooks

Paste the Maker key from that page into the constructor options, along with the smart plug's IP address as shown in the JavaScript example above.

### Create an IFTTT Recipe
The "IF" part of your recipe must be the Maker Channel.
* Trigger Channel = Maker
* Trigger = Receive a web request
* Event Name = ``appliance-completed``

The "DO" part of your recipe can be anything you want.  The example below sends a push notification to your mobile when your dishwasher has finished, along with the elapsed time it took to clean the dishes.

* Action Channel = IF notifications
* Action = Send a notification
* Notification = Notification text.


The `appliance-completed` event sends three ingredients that you can use in your notification text.

 - Value1 = run time pretty format, example "1hr 32m 03s"
 - Value2 = power usage in kilowatt hours
 - Value3 = estimated cost in $ based on electricity price `kwhPrice`

You can also create an additional recipe that is triggered by the ``appliance-started`` event, which does not contain any ingredients/values for use in notification text.

## Calibrating/Logging
Use the pollingCallback and eventCallback to observe the behavior of your appliance.  The pollingCallback will fire at every pollingInterval and return the current watts to help you determine what your wattsThreshold should be.  Or you could send this information to a database or front-end visualization.  The eventCallback will fire when your appliance starts, completes or an error occurs.

### appliance-completed event fires too early
If you are getting notifications that your appliance completed before it has actually completed, increase the endTimeWindowSeconds to be longer than any period of dormancy in your appliance's power usage.

### events fire multiple times
If you are getting multiple started/completed notifications because of power usage that occurs after the endTimeWindowSeconds, increase the cooldownPeriodSeconds which will stop polling for appliance wattage for the cooldown period.

## Other Recommendations

### Static/Reserved IP Address
You should set your router to always give your smart plug the same IP address (Reserved DHCP), otherwise the script will break if the IP address of the smart plug changes.

### Running the process continuously

A Node process manager, such as [pm2](http://pm2.keymetrics.io/), can be used to ensure this code is always running and monitoring your appliance's power usage, even if your computer restarts.
