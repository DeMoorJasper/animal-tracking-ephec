// Select your preferred method of sending data
#define CONTAINERS

#include <Wire.h>
#include <ATT_LoRaWAN.h>
#include <ATT_GPS.h>
#include "keys.h"
#include <MicrochipLoRaModem.h>

#define Serial_BAUD 57600

#define debugSerial Serial
#define loraSerial Serial1

#define DISTANCE 30.0
#define WAIT_INTERVAL 3600000
#define DELAY 2000

MicrochipLoRaModem modem(&loraSerial, &debugSerial);
ATTDevice device(&modem, &debugSerial, false, 7000);  // minimum time between 2 messages set at 7000 milliseconds

#include <Container.h>
Container container(device);

ATT_GPS gps(20,21);  // Reading GPS values from debugSerial connection with GPS

void setup() 
{
  debugSerial.begin(Serial_BAUD);
  while((!debugSerial) && (millis()) < 10000){}  // wait until the serial bus is available
  
  loraSerial.begin(modem.getDefaultBaudRate());  // set baud rate of the serial connection to match the modem
  while((!loraSerial) && (millis()) < 10000){}   // wait until the serial bus is available

  while(!device.initABP(DEV_ADDR, APPSKEY, NWKSKEY))
  debugSerial.println("Ready to send data");
    
  debugSerial.println("Initializing GPS");
}

void loop()
{
  readCoordinates();
  sendCoordinates();
  processQueue();
  
  delay(WAIT_INTERVAL);
}

void processQueue() {
  while(device.processQueue() > 0)
  {
    debugSerial.println("Flushing data to Enco...");
    delay(DELAY);
  }
}

void readCoordinates()
{
  while(gps.readCoordinates() == false)
  {
    debugSerial.println("no gps data...");
    
    delay(DELAY);
  }
}

void sendCoordinates()
{
  container.addToQueue(gps.latitude, gps.longitude, gps.altitude, gps.timestamp, GPS, false);

  debugSerial.println("Sending GPS Data:");
  debugSerial.print("lng: ");
  debugSerial.println(gps.longitude);
  debugSerial.print("lat: ");
  debugSerial.println(gps.latitude);
  debugSerial.print("alt: ");
  debugSerial.println(gps.altitude);
  debugSerial.print("time: ");
  debugSerial.println(gps.timestamp);
}
