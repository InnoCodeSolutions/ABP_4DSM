import pool from './db';

interface User {
  id: number;
  name: string;
  email: string;
}

export class UserDao {
  async getAllUsers(): Promise<User[]> {
    const res = await pool.query('SELECT * FROM login.users');
    return res.rows;
  }

  async getUserById(id: number): Promise<User | null> {
    const res = await pool.query('SELECT * FROM login.users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createUser(name: string, email: string,lastname: string, password: string): Promise<User> {
    const res = await pool.query(
      'INSERT INTO login.users (name, email,lastname, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email,lastname,password]
    );
    return res.rows[0];
  }
  async dropUser(id:number): Promise<User | null> {
    const res = await pool.query('DELETE FROM login.users WHERE id = $1;', [id]);
    return res.rows[0] || null;
  }
  async updateUser(id: number, name: string, lastname: string, email: string, password: string): Promise<User | null> {
    const res = await pool.query(
      `UPDATE login.users 
       SET name = $1, lastname = $2, email = $3, password = $4
       WHERE id = $5 
       RETURNING *`,
      [name, lastname, email, password, id]
    );
    return res.rows[0] || null;
  }

}
