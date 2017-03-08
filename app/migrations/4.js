module.exports = 
`
CREATE TABLE IF NOT EXISTS comments(
    id serial NOT NULL PRIMARY KEY,
    comment text NOT NULL,
    user_id integer NOT NULL,
    fact_id integer NOT NULL,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);`;