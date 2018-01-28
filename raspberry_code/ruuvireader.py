from ruuvitag_sensor.ruuvi import RuuviTagSensor, RunFlag
from ruuvitag_sensor.decoder import UrlDecoder
import threading
import urllib2,json
import settings

run_flag_outside = RunFlag()
run_flag_inside = RunFlag()

def send_data(loc_id, found_data):
  url = settings.KERTTU_SERVER_URL+'/api/v1/weatherData'
  postdata = {'deviceID': 1,
              'locID': loc_id,
              'temperature': found_data[1]['temperature'],
              'pressure': found_data[1]['pressure'],
              'humidity': found_data[1]['humidity'],
              'battery': found_data[1]['battery'] }

  req = urllib2.Request(url)
  req.add_header('Content-Type','application/json')
  data = json.dumps(postdata)

  timeout = 3
  try:
    response = urllib2.urlopen(req,data,timeout)
  except urllib2.HTTPError, e:
    print e.code
    print 'HTTP ERROR'
    pass
  except urllib2.URLError, e:
    print e.args
    print 'URL ERROR'
    pass
  except:
    print 'generic error'
    pass      
  return  

def handle_outside_data(found_data):
  #print('MAC ' + found_data[0])
  #print('Ulkomittaukset')
  #print(found_data[1])
  send_data(settings.LOC_ID_1, found_data)
  run_flag_outside.running = False
  return

def handle_inside_data(found_data):
  #print('MAC ' + found_data[0])
  #print('sisamittaukset')
  #print(found_data[1])
  send_data(settings.LOC_ID_2, found_data)
  run_flag_inside.running = False
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
