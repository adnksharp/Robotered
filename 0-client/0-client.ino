#include "config.h"
#include "pins.h"
#include <WiFi.h>
#include <HTTPClient.h>

unsigned long pings = 0;
bool locked = false;

void blinks(byte pin, byte times)
{
	digitalWrite(pin, pin == LED ? LOW : HIGH);
	delay(times);
	digitalWrite(pin, pin == LED ? HIGH : LOW);
	delay(times);
}

void newWifi()
{
	WiFi.disconnect();
	WiFi.begin(ssid, pass);
	while (WiFi.status() != WL_CONNECTED) 
		blinks(LED, 50);
}

void serialEvent()
{
	int httpCode = 0;
	String data = Serial.readStringUntil('\n');

	data.replace(" ", "");
	data.replace("\n", "");
	data.replace("\r", "");
	data.replace("\t", "");

	if (data.toInt() == 423)
	{
		if (WiFi.status() == WL_CONNECTED)
			WiFi.disconnect();
		locked = true;
		Serial.println("1");
		return;
	}
	else if (data.toInt() == 100)
	{
		locked = false;
		Serial.println("100");
		newWifi();
	}
	else if (data.toInt() == 205)
		ESP.restart();
	else if (data.length() > 0 && !locked)
	{
		if (WiFi.status() != WL_CONNECTED) 
			newWifi();
	
		WiFiClient client;
		HTTPClient http;

		http.begin(client, Server + server);
		http.addHeader("Content-Type", "application/x-www-form-urlencoded");
		Serial.println(String(http.POST(data)));
		http.end();
	} 
	else
		Serial.println("400");
}

void setup() 
{
	Serial.begin(115200);
	pinMode(LED, OUTPUT);
	pinMode(FLASH, OUTPUT);

	newWifi();

	Serial.println("100");
}

void loop(){}
