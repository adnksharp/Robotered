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
		data[0] = abs(map(ema.read(analogRead(LX), 0), LX_MIN, LX_MAX, 0, 180));
		data[1] = abs(map(ema.read(analogRead(LY), 1), LY_MIN, LY_MAX, 0, 180));
		data[2] = abs(map(ema.read(analogRead(LT), 2), LT_MIN, LT_MAX, 0, 180));
		data[3] = abs(map(ema.read(analogRead(RX), 3), RX_MIN, RX_MAX, 0, 180));
		data[4] = abs(map(ema.read(analogRead(RY), 4), RY_MIN, RY_MAX, 0, 180));
		data[5] = abs(map(ema.read(analogRead(RT), 5), RT_MIN, RT_MAX, 70, 120));
	}
	else
		analogWrite(RXD, 0);
}
