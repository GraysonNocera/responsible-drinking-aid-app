import Realm from 'realm';

// Define your object model
export class Session extends Realm.Object {
  static schema = {
    name: 'Session',
    properties: {
      _id: 'objectId',
      bacReadings: 'string',
      heartRateReadings: 'string',
      drinks: 'int',
    },
    primaryKey: '_id',
  };
}
