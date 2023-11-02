import Realm from 'realm';

// Define your object model
export class User extends Realm.Object {
  static schema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      height: 'int', // in inches
      weight: 'int', // in pounds
      isMale: 'bool', // true for male, false for female
    },
    primaryKey: '_id',
  };
}