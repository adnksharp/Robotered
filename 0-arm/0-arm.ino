#include <Servo.h>
#include "pins.h"

Servo A;
Servo B;
Servo C;
Servo D;
Servo E;
Servo F;

short val[] = {0, 0, 0, 0, 0, 70};

void setup() 
{
	Serial.begin(115200);
	A.attach(BASE);
	B.attach(SHOULDER);
	C.attach(ELBOW);
	D.attach(WRISTX);
	E.attach(WRISTY);
	F.attach(GRIPPER);
}

void loop() 
{
	if (Serial.available() > 0)
	{
		String message = Serial.readStringUntil('\n');
		for (int i = 0; i < 6; i++)
		{
			val[i] = message.substring(0, message.indexOf(',')).toInt();
			message = message.substring(message.indexOf(',') + 1);
		}
	}
	
	A.write(val[0]);
	B.write(val[1]);
	C.write(val[2]);
	D.write(val[3]);
	E.write(val[4]);
	F.write(val[5]);
}
