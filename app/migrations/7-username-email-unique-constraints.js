module.exports = 
`
ALTER TABLE users
ADD CONSTRAINT uq_email UNIQUE (email);
ALTER TABLE users
ADD CONSTRAINT uq_username UNIQUE (username);
`;

