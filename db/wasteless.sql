DROP TABLE IF EXISTS pantry;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(250) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE pantry (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1
    CHECK (quantity > 0),
  expiry_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'donated', 'used', 'wasted')),
  status_updated_at DATE
);
