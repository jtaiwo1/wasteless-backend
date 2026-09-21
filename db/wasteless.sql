CREATE TABLE pantry (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  expiry_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'donated', 'used', 'wasted'))
);
