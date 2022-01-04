CREATE TABLE IF NOT EXISTS indicator (
    id SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER NOT NULL REFERENCES indicator,
    "name" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_series (
    id SERIAL PRIMARY KEY,
    series_id INTEGER NOT NULL REFERENCES series,
    "name" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "event" (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER NOT NULL REFERENCES indicator,
    series_id INTEGER NOT NULL REFERENCES series,
    sub_series_id INTEGER NOT NULL REFERENCES sub_series,
    "date" DATE NOT NULL,
    "value" INTEGER NOT NULL
);
