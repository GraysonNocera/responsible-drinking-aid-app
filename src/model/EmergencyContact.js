import Realm from 'realm';

// Define your object model
export class EmergencyContact extends Realm.Object {
    static schema = {
      name: 'EmergencyContact',
      properties: {
        name: 'string',
        phoneNumber: 'string',
      },
    };
  }
  