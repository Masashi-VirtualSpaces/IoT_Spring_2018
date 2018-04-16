#4/16/17
import RPi.GPIO as GPIO
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

CONST_INPUT = 3
CONST_OUTPUT = 11

GPIO.setup(CONST_OUTPUT,GPIO.OUT,initial=GPIO.HIGH)
GPIO.setup(CONST_INPUT,GPIO.IN)

GPIO.output(CONST_OUTPUT)
GPIO.input(CONST_INPUT)
#Define pin 3 as an output pin
#Define pin 11 as an input pin

while True:
    sensor = GPIO.input(CONST_INPUT)
    if (sensor == False):
        print ("No intruders", sensor)
        #Turns off the LED
        time.sleep(1.5)

    elif (sensor ==  True):
        print ("Intruder detected", sensor)
        #Turns on the LED
        time.sleep(1.5)
