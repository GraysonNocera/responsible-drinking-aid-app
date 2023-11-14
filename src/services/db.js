import { Session } from '../model/Session';
import { User } from '../model/User';
import { EmergencyContact } from '../model/EmergencyContact';

// Create a configuration object
export default {
  schema: [Session, User, EmergencyContact],
  schemaVersion: 2,
};
