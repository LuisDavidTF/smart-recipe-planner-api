import {createUser} from '../users/user.repositoy.js';

export async function registerUser(data) {
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt(10);
    data.password_hash = await bcrypt.hash(data.password_hash, salt);
  const user = await createUser(data);
  return user;
}