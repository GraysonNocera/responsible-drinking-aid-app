export const BluetoothMessages = {
  addDrink: "Add Drink",
  subtractDrink: "Subtract Drink",
  clearDrinks: "Clear Drinks",
  // drinkTimerStart: "Drink Timer Start",
  // drinkTimerReset: "Drink Timer Reset",
  ethanolSensorOn: "Ethanol Sensor ON", // send notification as soon as we receive this asking them to take a BAC reading
  ethanolSensorOff: "Ethanol Sensor OFF", // send notification when we receive this (ethanol sensor off), hold top button for 5 seconds to turn back on
	ethanol: "BAC",
  // adc: "ADC",
}

export const NOTIFICATION_AFTER_DRINK = 20; // in minutes
export const NOTIFICATION_AFTER_ETHANOL = 30; // in minutes
export const MILLIS_TO_SECONDS = 1000;
export const SECONDS_TO_MINUTES = 60;

export const WIDMARK_MEN_FACTOR = 0.7;
export const WIDMARK_WOMEN_FACTOR = 0.6;
export const WIDMARK_CONSTANT = 100;

export const LBS_TO_GRAMS = 453.592;
export const GRAMS_PER_DRINK = 14;

