module.exports = 
`CREATE TABLE IF NOT EXISTS users(
    id serial NOT NULL PRIMARY KEY,
    username varchar(100) NOT NULL, 
    password varchar(100) NOT NULL,
    firstname varchar(100) NOT NULL,
    lastname varchar(100) NOT NULL,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);`;