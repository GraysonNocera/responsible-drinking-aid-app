import Realm from 'realm';

// Define your object model
export class User extends Realm.Object {
  static schema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      height: 'int', // in inches
      weight: 'int', // in pounds
    },
    primaryKey: '_id',
  };
}