import * as Constants from '../constants';

export const calculateRiskFactor = (bac, drinkCount, height, weight, isMale) => {
  // calculate risk factor

  // TODO: figure out better formula
  return bac * drinkCount * height * weight * (isMale ? 0.7 : 0.6);
}

export const calculateWidmark = (drinkCount, isMale, weight) => {
  let genderFactor = isMale ? Constants.WIDMARK_MEN_FACTOR : Constants.WIDMARK_WOMEN_FACTOR;
  return Constants.WIDMARK_CONSTANT * (drinkCount * Constants.GRAMS_PER_DRINK) / (weight * Constants.LBS_TO_GRAMS * genderFactor);
}

export const lbsToGrams = (lbs) => {
  return lbs * Constants.LBS_TO_GRAMS;
}