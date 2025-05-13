import pool from './db';

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string; // Adicione phone como opcional na interface
}

export class UserDao {
  deleteUser(id: number) {
    throw new Error('Method not implemented.');
  }

  async getAllUsers(): Promise<User[]> {
    const res = await pool.query('SELECT * FROM login.users');
    return res.rows;
  }

  async getUserById(id: number): Promise<User | null> {
    const res = await pool.query('SELECT * FROM login.users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const res = await pool.query('SELECT * FROM login.users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user; // Returns true if email exists, false otherwise
  }

  async createUser(name: string, email: string, lastname: string, password: string, phone?: string): Promise<User> {
    const emailExists = await this.checkEmailExists(email);
    if (emailExists) {
      throw new Error("E-mail já cadastrado.");
    }
    const res = await pool.query(
      'INSERT INTO login.users (name, email, lastname, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, lastname, password, phone || null] // phone é opcional
    );
    return res.rows[0];
  }

  async updateUser(id: number, name: string, lastname: string, email: string, password: string, phone?: string): Promise<User | null> {
    const res = await pool.query(
      'UPDATE login.users SET name = $1, lastname = $2, email = $3, password = $4, phone = $5 WHERE id = $6 RETURNING *',
      [name, lastname, email, password, phone || null, id] // phone é opcional
    );
    return res.rows[0] || null;
  }

  async dropUser(id: number): Promise<void> {
    await pool.query('DELETE FROM login.users WHERE id = $1', [id]);
  }
}