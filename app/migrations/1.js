module.exports =      
`
CREATE TABLE IF NOT EXISTS options(
    id serial NOT NULL PRIMARY KEY,
    option varchar(30) NOT NULL UNIQUE, 
    value varchar(100) NOT NULL,
    created_at timestamp with time zone default current_timestamp
);`;


