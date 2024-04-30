#include "pins.h"
#include "filter.h"

filter ema;

int status = 0;
short data[6] = {0, 0, 0, 0, 0, 0};

void serialEvent()
{
	if(Serial.available())
	{
		int cmd = Serial.readStringUntil('\n').toInt();
		if(cmd == 205 || cmd == 100 || cmd == 423)
		{
			Serial3.println(cmd);
			Serial.println("[MEGA] {" + String(cmd) + "}");
		}
	}
}
void serialEvent3()
{
	analogWrite(WEB, 0);
	if(Serial3.available())
	{
		status = Serial3.readStringUntil('\n').toInt();
		digitalWrite(RUN, status == 100);
		digitalWrite(ERR, status != 200 && status != 100);
		analogWrite(HME, 20);
		if(status != 0 && status != 200)
			Serial.println("[ESPM] {" + String(status) + "}");
		if (status == 200 || status == 100)
		{
			delay(70);
			Serial3.println(
				"A=" + String(data[0]) + "&B=" + String(data[1]) + "&C=" + String(data[2]) + 
				"&D=" + String(data[3]) + "&E=" + String(data[4]) + "&F=" + String(data[5])
			);
			analogWrite(WEB, 100);
			analogWrite(HME, 0);
		}
		else if (status < 0)
		{
			delay(2000);
			Serial3.println(100);
		}
	}
}

void setup()
{
	for (int i = 2; i < 8; i++)
		pinMode(i, OUTPUT);
	pinMode(13, OUTPUT);
	
	digitalWrite(RUN, HIGH);
	
	Serial.begin(115200);
	//Serial2.begin(115200); // pins extra
	Serial3.begin(115200); // ESP32 pins

	ema.alpha = 0.85;
	Serial3.println(205);
}

void loop()
{
	if (status == 200 || status == 100)
	{
		analogWrite(RXD, 50);
		data[0] = ema.read((pow(512-analogRead(LX), 3))/1480000+90, 0);
		data[1] = ema.read((pow(512-analogRead(LY), 2))/1432, 1);
		data[2] = ema.read((pow(508-analogRead(RX), 2))/1425, 2);
		data[3] = ema.read((pow(analogRead(LT), 2))/3550, 3);
		data[4] = ema.read((pow(512-analogRead(RY), 2))/1435, 4);
		data[5] = ema.read(((pow(analogRead(RT), 2))/17000)+68, 5);
	}
	else
		analogWrite(RXD, 0);
	/*Serial2.println(
		String(data[0]) + "," + String(data[1]) + "," + String(data[2]) + 
		"," + String(data[3]) + "," + String(data[4]) + "," + String(data[5]) + ","
	);*/
}
