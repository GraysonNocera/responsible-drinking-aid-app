import { Session } from '../model/Session';
import { User } from '../model/User';
import { EmergencyContact } from '../model/EmergencyContact';
import Realm from 'realm';

// Create a configuration object
export default {
  schema: [Session, User, EmergencyContact],
};

// Realm.deleteFile({ schema: [Session, User] });
