module.exports = 
`
CREATE VIEW v_users AS 
(SELECT * FROM USERS);
CREATE VIEW v_facts AS 
(SELECT * FROM facts);
CREATE VIEW v_votes AS 
(SELECT * FROM votes);
CREATE VIEW v_comments AS 
(SELECT * FROM comments);
`;

