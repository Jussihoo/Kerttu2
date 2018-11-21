import sys
import time, datetime
from ruuvitag_sensor.ruuvi import RuuviTagSensor, RunFlag
from ruuvitag_sensor.decoder import UrlDecoder
import threading
import urllib2,json
import settings

run_flag_outside = RunFlag()
run_flag_inside = RunFlag()

send_buffer_loc_1 = []
send_buffer_loc_2 = []

def get_timestamp():
  d = datetime.datetime.now()
  return time.mktime(d.timetuple())

def send_data(loc_id, found_data):
  url = settings.KERTTU_SERVER_URL+'/api/v1/weatherData'
  postdata = {'deviceID': 1,
              'locID': loc_id,
              'temperature': found_data[1]['temperature'],
              'pressure': found_data[1]['pressure'],
              'humidity': found_data[1]['humidity'],
              'battery': found_data[1]['battery'],
              'timestamp': get_timestamp()}
  data = []
  global send_buffer_loc_1
  global send_buffer_loc_2
  if (loc_id == settings.LOC_ID_1 ):
    send_buffer_loc_1.append(postdata)
    data = json.dumps(send_buffer_loc_1)
  elif (loc_id == settings.LOC_ID_2 ):
    send_buffer_loc_2.append(postdata)
    data = json.dumps(send_buffer_loc_2)

  req = urllib2.Request(url)
  req.add_header('Content-Type','application/json')
  timeout = 3
  try:
    response = urllib2.urlopen(req,data,timeout)
    status = 'ok'
  except urllib2.HTTPError, e:
    print e.code
    print 'HTTP ERROR'
    status = 'nok'
    pass
  except urllib2.URLError, e:
    print e.args
    print 'URL ERROR'
    status = 'nok'
    pass
  except:
    print 'generic error', sys.exc_info()[0]
    status = 'nok'
    pass      
  return status

def handle_outside_data(found_data):
  run_flag_outside.running = False
  #print('MAC ' + found_data[0])
  #print('Ulkomittaukset')
  #print(found_data[1])
  status = send_data(settings.LOC_ID_1, found_data)
  if (status == 'ok'):
    global send_buffer_loc_1
    send_buffer_loc_1 = []
  return

def handle_inside_data(found_data):
  run_flag_inside.running = False
  #print('MAC ' + found_data[0])
  #print('sisamittaukset')
  #print(found_data[1])
  status = send_data(settings.LOC_ID_2, found_data)
  if (status == 'ok'):
    global send_buffer_loc_2
    send_buffer_loc_2 = []
  return

def cancel_measurements():
  # stop waiting for sensor datas in case
  # ruuvitag is broken or out or range or out of juice
  run_flag_outside.running = False
  run_flag_inside.running = False
  
def get_measurements():
  run_flag_outside.running = True
  run_flag_inside.running = True
  t2 = threading.Timer(settings.SUPERVISION_PERIOD, cancel_measurements)
  ts.start()
  RuuviTagSensor.get_datas(handle_outside_data, settings.RUUVI_OUTSIDE, run_flag_outside)
  RuuviTagSensor.get_datas(handle_inside_data, settings.RUUVI_INSIDE, run_flag_inside)
  t1 = threading.Timer(settings.MEASUREMENT_INTERVAL, get_measurements)
  t1.start()
  
get_measurements() # start the measurement loop
