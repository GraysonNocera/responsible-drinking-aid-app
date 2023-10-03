import {createRealmContext} from '@realm/react';
import { Session } from '../model/Session';
import { User } from '../model/User';
import Realm from 'realm';

// Create a configuration object
const realmConfig = {
  schema: [Session, User],
};

// Create a realm context
const {RealmProvider, useRealm, useObject, useQuery} =
  createRealmContext(realmConfig);
