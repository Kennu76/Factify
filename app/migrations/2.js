module.exports =      
`
CREATE TABLE IF NOT EXISTS facts(
    id serial NOT NULL PRIMARY KEY,
    fact text NOT NULL, 
    title varchar(100) NOT NULL,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    user_id integer not null
);`;
