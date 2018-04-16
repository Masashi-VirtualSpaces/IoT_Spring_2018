#4/16/17
import RPi.GPIO as GPIO
import time


import httplib, urllib

key = 'A86H9XNAIHMD6FC8' #write APIkey from ThingSpeak

params = urllib.urlencode({'field8':sensor, 'key':key}) #Parameters channel field and data sent
headers = {"Content-typZZe":"application/x-www-form-    urlencoded","Accept":"text/plain"}
conn = httplib.HTTPConnection("api.thingspeak.com:80")
try: #Sending to ThingSpeak
	conn.request("POST", "/update", params, headers)
	response = conn.getresponse()
	print (sensor)
	#print (response.status, response.reason)
	data = response.read()
	conn.close()
except:
	print ("connection failed")



GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

CONST_INPUT = 11
CONST_OUTPUT = 3

GPIO.setup(CONST_OUTPUT,GPIO.OUT,initial=GPIO.HIGH)
GPIO.setup(CONST_INPUT,GPIO.IN)

#GPIO.output(CONST_OUTPUT,True)
#GPIO.input(CONST_INPUT)
#Define pin 3 as an output pin
#Define pin 11 as an input pin

while True:
    sensor = GPIO.input(CONST_INPUT)
    if (sensor == False):
        print ("No intruders", sensor)
        #Turns off the LED
        time.sleep(1.5)
        GPIO.output(CONST_OUTPUT,False)

    elif (sensor ==  True):
        print ("Intruder detected", sensor)
        GPIO.output(CONST_OUTPUT,True)
        #Turns on the LED
        time.sleep(1.5)
