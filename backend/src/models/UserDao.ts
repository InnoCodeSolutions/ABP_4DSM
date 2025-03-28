import pool from './db';

interface User {
  id: number;
  name: string;
  email: string;
}

export class UserDao {
  async getAllUsers(): Promise<User[]> {
    const res = await pool.query('SELECT * FROM public.users');
    return res.rows;
  }

  async getUserById(id: number): Promise<User | null> {
    const res = await pool.query('SELECT * FROM public.users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createUser(name: string, email: string,lastname: string, password: string): Promise<User> {
    const res = await pool.query(
      'INSERT INTO public.users (name, email,lastname, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email,lastname,password]
    );
    return res.rows[0];
  }
}
