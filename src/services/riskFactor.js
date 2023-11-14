import * as Constants from '../constants';

export const calculateRiskFactor = (bac, drinkCountTimestamps, height, weight, isMale) => {
  // calculate risk factor
  // TODO: normalize bac and drinkCount to be between 0 and 100

  let drinkCount = 0;
  const now = new Date();
  const time = 1000 * 60 * 60;

  drinkCountTimestamps.reverse();
  
  while (drinkCountTimestamps.length > drinkCount && now - drinkCountTimestamps[drinkCount] < time) {
    drinkCount++;
  }

  drinkCountTimestamps.reverse();

  return bac * 0.8 + drinkCount * 0.2;
}

export const calculateWidmark = (drinkCount, isMale, weight) => {
  let genderFactor = isMale ? Constants.WIDMARK_MEN_FACTOR : Constants.WIDMARK_WOMEN_FACTOR;
  return Constants.WIDMARK_CONSTANT * (drinkCount * Constants.GRAMS_PER_DRINK) / (weight * Constants.LBS_TO_GRAMS * genderFactor);
}

export const lbsToGrams = (lbs) => {
  return lbs * Constants.LBS_TO_GRAMS;
}
