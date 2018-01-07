# Kerttu 2

Weather station based on Ruuvitags, Raspberry PI 3 B, MEAN, AWS and the lovely Finnish weather 

## Configuring the Ruuvitag bluetooth beacons

Add instructions here
  
## Instructions for the Raspberry PI 3

### Installation instructions

To be added...

### Start ruuvireader
Go to /home/pi/Documents/Kerttu2
Start the ruuvireader.py with this command:

nohup python ruuvireader.py > ruuvi.log &

The logs can be read from ruuvi.log

### Stop ruuvireader

To see the process ID of the ruuvireader type:
ps -ef | grep ruuvi

e.g. pi        6712  5566  2 19:26 pts/0    00:00:00 python ruuvireader.py

and then kill 6712 to stop the process

## Instructions for the NodeJS server plus the UI code

### installation instructions

- clone the software from this repository
- type `npm install` to install all the needed nodejs modules
- make needed configuration changes. E.g. change the following settings:
  - `TOKEN` and `FEED_ID` in the `server/config/facebook.js` file
  - `APP_ID` in the `public/modules/weatherForecast/forecastConstants.js` file
- type `npm start` to run the server to test it works

### how to run the server on AWS

Install `Forever` if not installed already and then type `forever start -c "npm start" ./` in the directory where you cloned the server.

### how to stop the server on AWS

Add instructions...
