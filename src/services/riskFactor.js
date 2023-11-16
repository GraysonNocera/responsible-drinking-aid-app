import * as Constants from '../constants';
import { setNotification } from './notifications';

export const calculateRiskFactor = (bac, drinkCountTimestamps) => {
  // calculate risk factor
  // TODO: normalize bac and drinkCount to be between 0 and 100

  let drinkCount = 0;
  const now = new Date();
  const time = 1000 * 60 * 60;

  drinkCountTimestamps.reverse();
  
  while (drinkCountTimestamps.length > drinkCount && now - drinkCountTimestamps[drinkCount] < time) {
    drinkCount++;
  }

  const bacLb = 0;
  const bacUb = 0.25;
  const bacNewUb = 100;
  const drinkCountLb = 0;
  const drinkCountUb = 6;
  const drinkCountNewUb = 100;

  bac = normalize(bac, bacLb, bacUb, bacNewUb);
  drinkCount = normalize(drinkCount, drinkCountLb, drinkCountUb, drinkCountNewUb);

  drinkCountTimestamps.reverse();

  console.log("bac: " + bac);
  console.log("drinkCount: " + drinkCount);

  return bac > 0.02 ? bac * 0.8 + drinkCount * 0.2 : drinkCount * 0.6;
}

export const calculateAndHandleRiskFactor = async (bac, drinkCountTimestamps, highRiskNotificationId) => {
  const riskFac = calculateRiskFactor(bac, drinkCountTimestamps);
  console.log("Risk factor: " + riskFac)
  if (riskFac > Constants.HIGH_RISK && !highRiskNotificationId.current) {
    highRiskNotificationId.current = await setNotification('High Risk!', 'You are at high risk of injury. Use the app to call emergency services or loved ones.', 2);
    console.log("High risk notification id: " + highRiskNotificationId.current)
  } else if (riskFac <= Constants.HIGH_RISK && highRiskNotificationId.current) {
    highRiskNotificationId.current = null;
  }

  return Promise.resolve(riskFac);
}

const normalize = (value, lb, ub, newUb, newLb=0) => {
  return ((value - lb) / (ub - lb)) * (newUb - newLb) + newLb;
}

export const calculateWidmark = (drinkCount, isMale, weight) => {
  let genderFactor = isMale ? Constants.WIDMARK_MEN_FACTOR : Constants.WIDMARK_WOMEN_FACTOR;
  return Constants.WIDMARK_CONSTANT * (drinkCount * Constants.GRAMS_PER_DRINK) / (weight * Constants.LBS_TO_GRAMS * genderFactor);
}

export const lbsToGrams = (lbs) => {
  return lbs * Constants.LBS_TO_GRAMS;
}
