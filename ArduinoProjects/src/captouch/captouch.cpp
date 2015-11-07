/*********************************************************
This is a library for the MPR121 12-channel Capacitive touch sensor

Designed specifically to work with the MPR121 Breakout in the Adafruit shop 
  ----> https://www.adafruit.com/products/

These sensors use I2C communicate, at least 2 pins are required 
to interface

Adafruit invests time and resources providing this open source code, 
please support Adafruit and open-source hardware by purchasing 
products from Adafruit!

Written by Limor Fried/Ladyada for Adafruit Industries.  
BSD license, all text above must be included in any redistribution
**********************************************************/

#include <Wire.h>
#include <Adafruit_MPR121.h>
#include "BlinkM.h"

// Function prototypes
void welcome_message(void);
void cap_routine();

// You can have up to 4 on one i2c bus but one is enough for testing!
Adafruit_MPR121 cap = Adafruit_MPR121(1, 1);

void cap_setup() {
  while (!Serial);
  // Default address is 0x5A, if tied to 3.3V its 0x5B
  // If tied to SDA its 0x5C and if SCL then 0x5D
  if (!cap.begin(0x5A)) {
    Serial.println("MPR121 not found, check wiring?");
    while (1);
  }
  Serial.println("MPR121 found!");
}

void print_record(uint8_t i, uint8_t data){
  Serial.print("cap"); Serial.print("\t"); 
  Serial.print(i); Serial.print("\t"); 
  Serial.println(data);

}
void cap_routine() {
  print_record(0, cap.filteredData(0));
  print_record(1, cap.filteredData(1));
  print_record(2, cap.filteredData(2));
  delay(100);
}


void welcome_message(void){
	Serial.println("Adafruit MPR121 Capacitive Touch Sensor HapticPrintDemo"); 
}

void setup(){
  Serial.begin(9600);
  welcome_message();
  cap_setup();
}

void loop(){ 
   cap_routine();
}



