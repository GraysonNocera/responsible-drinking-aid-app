import { Session } from '../model/Session';
import { User } from '../model/User';
import Realm from 'realm';

// Create a configuration object
export default {
  schema: [Session, User],
};

// Realm.deleteFile({ schema: [Session, User] });
