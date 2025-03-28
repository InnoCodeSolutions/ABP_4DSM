import { UserDao } from './models/UserDao';

(async () => {
  const dao = new UserDao();
  
  const newUser = await dao.createUser('Alice', 'alice5@example.com','Felicia','0909');
  console.log('Created:', newUser);

  const users = await dao.getAllUsers();
  console.log('All users:', users);
})();
