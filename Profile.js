class Profile extends Realm.Object {
  static schema = {
    name: 'Profile',
    properties: {
      name: {type: 'string', indexed: true},
      price: 'int',
    },
  };
}