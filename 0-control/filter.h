struct filter
{
	float alpha = 0;
	short pass[6] = {0};

	short read(short value, byte i)
	{
		pass[i] = (alpha * value) + ((1 - alpha) * pass[i]);
		return pass[i];
	}
};
