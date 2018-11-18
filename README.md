# Kerttu 2

Weather station based on Ruuvitags, Raspberry PI 3 B, MEAN, AWS and the lovely Finnish weather

<br>
  <img width="300" src="https://github.com/Jussihoo/Kerttu2/blob/master/images/weather_screenshot_computer.PNG"
  <img width="300" src="https://github.com/Jussihoo/Kerttu2/blob/master/images/weather_screenshot2_computer.PNG"
</br>

<br>
  <img width="300" src="https://github.com/Jussihoo/Kerttu2/blob/master/images/forecast_screenshot_computer.PNG"
</br>

<br>
  <img width="300" src="https://github.com/Jussihoo/Kerttu2/blob/master/images/weather_screenshot_phone.png"
</br>

## About Kerttu

Kerttu is based on [Ruuvitags ](https://ruuvi.com/), which are measuring temperature, air pressure and humidity. Also the ruuvitag battery voltage is measured. Ruuvitag is basically a Bluetooth LE beacon, which broadcast the measurements frequently ( I guess it's like once or twice per second).

My python code running in Raspberry wakes up every ten minutes to get these broadcasts and to read the measurement data and then sends those to the server's REST API.

NodeJS based Server is running in AWS. It has REST APIs for receiving the measurements and for fetching the measurements from the MongoDB database, into which these measurements are stored.

UI is implemented with Bootstrap and AngularJS. Scales nicely to phones.

## Configuring the Ruuvitag bluetooth beacons

Add instructions here
  
## Instructions for the Raspberry PI 3

### Installation instructions

To be added...

### Start ruuvireader
Go to /home/pi/Documents/Kerttu2
Start the ruuvireader.py with this command:

nohup python -u ruuvireader.py > ruuvi.out 2> ruuvi.err < /dev/null &

The logs can be read from ruuvi.out and error log from ruuvi.err

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

Type command `ps aux | grep 'forever\|node'` to get the two processes for the server and then kill those 
