module.exports = 
`
ALTER TABLE users
ADD COLUMN fbid varchar(100) UNIQUE NOT NULL;
`;

