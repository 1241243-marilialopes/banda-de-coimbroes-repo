import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME || 'bd_pap',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });

if (process.env.NODE_ENV !== 'production') {
  global.mysqlPool = pool;
}

export default pool;

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

