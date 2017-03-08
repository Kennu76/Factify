module.exports = 
`
CREATE TABLE IF NOT EXISTS votes(
    id serial NOT NULL PRIMARY KEY,
    user_id integer NOT NULL,
    fact_id integer NOT NULL,
    type integer NOT NULL,
    created_at timestamp with time zone default current_timestamp
);`;

