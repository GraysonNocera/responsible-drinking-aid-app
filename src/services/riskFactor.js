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

  const bac_lb = 0;
  const bac_ub = 0.25;
  const bac_new_ub = 100;
  const drinkCount_lb = 0;
  const drinkCount_ub = 6;
  const drinkCount_new_ub = 100;

  bac = normalize(bac, bac_lb, bac_ub, bac_new_ub);
  drinkCount = normalize(drinkCount, drinkCount_lb, drinkCount_ub, drinkCount_new_ub);

  drinkCountTimestamps.reverse();

  return bac * 0.8 + drinkCount * 0.2;
}

const normalize = (value, lb, ub, new_ub, new_lb=0) => {
  return ((value - lb) / (ub - lb)) * (new_ub - new_lb) + new_lb;
}

export const calculateWidmark = (drinkCount, isMale, weight) => {
  let genderFactor = isMale ? Constants.WIDMARK_MEN_FACTOR : Constants.WIDMARK_WOMEN_FACTOR;
  return Constants.WIDMARK_CONSTANT * (drinkCount * Constants.GRAMS_PER_DRINK) / (weight * Constants.LBS_TO_GRAMS * genderFactor);
}

export const lbsToGrams = (lbs) => {
  return lbs * Constants.LBS_TO_GRAMS;
}
