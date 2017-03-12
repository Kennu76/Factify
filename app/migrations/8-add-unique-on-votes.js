module.exports = 
`
ALTER TABLE votes 
ADD CONSTRAINT uq_vote UNIQUE (user_id, fact_id);
`;