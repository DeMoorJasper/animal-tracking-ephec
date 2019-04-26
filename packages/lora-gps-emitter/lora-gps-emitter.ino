#define CONTAINERS

#include <Wire.h>
#include <ATT_LoRaWAN.h>
#include <ATT_GPS.h>
#include "keys.h"
#include <MicrochipLoRaModem.h>
#include <Container.h>

#define Serial_BAUD 57600

#define debugSerial Serial
#define loraSerial Serial1

#define DISTANCE 30.0
#define WAIT_INTERVAL 3600000
#define DELAY 250

MicrochipLoRaModem modem(&loraSerial, &debugSerial);
ATTDevice device(&modem, &debugSerial, false, 7000);  // minimum time between 2 messages set at 7000 milliseconds

Container container(device);

ATT_GPS gps(20, 21); // Reading GPS values from debugSerial connection with GPS

void setup()
{
  // Init debug output
  debugSerial.begin(Serial_BAUD);
  while ((!debugSerial)) {
    delay(DELAY);
  }

  // Init lora output
  loraSerial.begin(modem.getDefaultBaudRate());  // set baud rate of the serial connection to match the modem
  while ((!loraSerial)) {
    delay(DELAY);
  }

  // Init Lora ABP
  while (!device.initABP(DEV_ADDR, APPSKEY, NWKSKEY)) {
    delay(DELAY);
  }

  // Done.
  debugSerial.println("Initialised");
}

void loop()
{
  readCoordinates();
  sendCoordinates();
  processQueue();

  // Idle the device untill we need more data...
  delay(WAIT_INTERVAL);
}

void processQueue() {
  while (device.processQueue() > 0)
  {
    delay(DELAY);
  }

  debugSerial.println("Flushed data to Lora Network...");
}

void readCoordinates()
{
  while (gps.readCoordinates() == false)
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
