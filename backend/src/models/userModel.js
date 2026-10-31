const USER_COLUMNS = "id, full_name, email, created_at";

export async function createUser(pool, { fullName, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (full_name, email, password)
     VALUES ($1, $2, $3)
     RETURNING ${USER_COLUMNS}`,
    [fullName, email, passwordHash],
  );
  return rows[0];
}

export async function getUsers(pool) {
  const { rows } = await pool.query(
    `SELECT ${USER_COLUMNS} FROM users ORDER BY id ASC`,
  );
  return rows;
}

export async function getUserById(pool, id) {
  const { rows } = await pool.query(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function updateUser(pool, id, { fullName, email, passwordHash }) {
  const { rows } = await pool.query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         email = COALESCE($3, email),
         password = COALESCE($4, password)
     WHERE id = $1
     RETURNING ${USER_COLUMNS}`,
    [id, fullName ?? null, email ?? null, passwordHash ?? null],
  );
  return rows[0] ?? null;
}

export async function deleteUser(pool, id) {
  const { rows } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [id],
  );
  return rows.length > 0;
}