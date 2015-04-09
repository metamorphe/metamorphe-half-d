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

// You can have up to 4 on one i2c bus but one is enough for testing!
Adafruit_MPR121 cap = Adafruit_MPR121(1, 1);

// Keeps track of the last pins touched
// so we know when buttons are 'released'
uint16_t lasttouched = 0;
uint16_t currtouched = 0;

void cap_setup() {
  while (!Serial);        // needed to keep leonardo/micro from starting too fast!
  // Default address is 0x5A, if tied to 3.3V its 0x5B
  // If tied to SDA its 0x5C and if SCL then 0x5D
  if (!cap.begin(0x5A)) {
    Serial.println("MPR121 not found, check wiring?");
    while (1);
  }
  Serial.println("MPR121 found!");
}

void cap_routine() {
  // Get the currently touched pads
  // currtouched = cap.touched();
  
  // for (uint8_t i=0; i<12; i++) {
  //   // it if *is* touched and *wasnt* touched before, alert!
  //   if ((currtouched & _BV(i)) && !(lasttouched & _BV(i)) ) {
  //     Serial.print(i); Serial.println(" touched");
  //   }
  //   // if it *was* touched and now *isnt*, alert!
  //   if (!(currtouched & _BV(i)) && (lasttouched & _BV(i)) ) {
  //     Serial.print(i); Serial.println(" released");
  //   }
  // }

  // reset our state
  // lasttouched = currtouched;

  // comment out this line for detailed data from the sensor!
  // return;
  
  // debugging info, what
  Serial.print("\t\t\t\t\t\t\t\t\t\t\t\t\t 0x"); Serial.print(cap.touched(), HEX);
  Serial.print(" Filt: ");
  uint8_t i = 2; 
  // for (uint8_t i=0; i<12; i++) {
    Serial.print(cap.filteredData(i)); Serial.print("\t");
  // }
  // Serial.println();
  Serial.print(" Base: ");
  // for (uint8_t i=0; i<12; i++) {
    Serial.print(cap.baselineData(i)); Serial.print("\t");
  // }
  // Serial.println();
  
  // put a delay so it isn't overwhelming
  delay(100);
}




#define IS_DIGIT(c) ((c >= '0' && c <= '9') ? 1 : 0)
#define SERIAL_BUFFER_SIZE 32


// Function prototypes
void help (void);
uint8_t readSerialString (void);
void handle_button_press (void);
void handle_alloc_message (void);
void handle_line_message (void);
void actuate (void);
uint8_t readSerialString (void);
void welcome_message(void);

uint16_t this_node;
int received;
char serInStr[SERIAL_BUFFER_SIZE];





/* Main Code */

void welcome_message(void){
	Serial.println("Adafruit MPR121 Capacitive Touch sensor test"); 
}


void help (void){
  Serial.println("\r\nCapTouch Deluxe!\r\n"
   "'p' to write the script and play once\r\n"
   "'<node address>' to send the script to a specified node\r\n"
   "'o' to stop script playback\r\n"
   "'x' to fade to black\r\n"
   "'f' to flash red\r\n"
   ); 
}


void setup(){
  Serial.begin(9600);
  cap_setup();
  welcome_message();
}


bool cap_enabled = false;
uint8_t press = 255;
uint8_t release = 255;

void loop(){ 
  //read the serial port and create a string out of what you read
  
  if( readSerialString() ) {
    Serial.println(serInStr);
    char cmd = serInStr[0];
    Serial.print("\n");

    if ( cmd == 'e' ) {
    	cap_enabled = !cap_enabled;
	    if(cap_enabled) Serial.println("cap enabled");
	  	else Serial.println("cap disabled");
    }
    else if( cmd == 'a' ) {
    	press++;
    	Serial.print("Press: ");
    	Serial.println(press); 
    }
    else if( cmd =='s' ) {
    	press --;
    	Serial.print("Press: ");
    	Serial.println(press); 
    }
    else if( cmd =='d' ) {
   		release ++;
    	Serial.print("Release: ");
    	Serial.println(release); 
    }
    else if(cmd =='f'){
   		release --;
    	Serial.print("Release: ");
    	Serial.println(release); 
    }
    else if(cmd == 't'){
      Serial.print("Switching to touch mode");
      cap.stop();
      cap.set_baselineData(2, 0xB8);
      cap.resume();
    }
    else if(cmd == 'p'){
      Serial.print("Switching to press mode");
      cap.stop();
      cap.set_baselineData(2, 0xB7);
      cap.resume();
    }
    else if(cmd =='u'){
    	Serial.print("Updated!: ");
    	Serial.print(press); 
    	Serial.println(release); 
      // cap.stop();
      // Serial.println("MPR121 stopped");
    	cap = Adafruit_MPR121(press, release);
    	 if (!cap.begin(0x5A)) {
          Serial.println("MPR121 not found, check wiring?");
          while (1);
        }
        else{
          Serial.println("Success");
        }
    }
    else{
      Serial.print("Command "); 
      Serial.print(cmd);
      Serial.println(" received, but not understood.");
    }
  }
  if(cap_enabled) cap_routine();

}




uint8_t readSerialString (void)
{
  if(!Serial.available()) {
    return 0;
  }
  delay(10);  // wait a little for serial data
  int i = 0;
  while (Serial.available()) {
    if(i >= (SERIAL_BUFFER_SIZE - 1)){ //need extra byte to hold terminating 0
      Serial.println("Serial buffer overflow!");
      break;
    }
    serInStr[i] = Serial.read();   
    // Check buffer overflow
    i++;
  }
  serInStr[i] = '\0';  // indicate end of read string
  return i;  // return number of chars read
}



