
CREATE TABLE industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
);
CREATE TABLE level1 (
	id INTEGER,
    name TEXT,
    industry_id INTEGER,
    PRIMARY KEY (industry_id, name),  -- Composite primary key on both columns
    FOREIGN KEY (industry_id) REFERENCES industries(id)  -- Assumes 'industries' table has a column 'id'
);

CREATE INDEX industry_id_idx ON level1(industry_id);

CREATE TABLE level2 (
	id INTEGER,
    name TEXT,
    level1_id INTEGER,
    PRIMARY KEY (level1_id, name),  -- Composite primary key on both columns
    FOREIGN KEY (level1_id) REFERENCES level1(id)  -- Assumes 'industries' table has a column 'id'
);


CREATE INDEX level1_id_idx ON level2(level1_id);