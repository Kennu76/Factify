module.exports = 
`
CREATE FUNCTION insert_facts(_fact text,_title text,_user_id integer)
RETURNS void AS
$BODY$
    BEGIN
    INSERT INTO facts(fact, title, user_id)
    VALUES(_fact, _title, _user_id);
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
COST 100;

CREATE FUNCTION insert_users(_username varchar(100), _firstname varchar(100) ,_lastname varchar(100), _password varchar(100), _email varchar(100))
RETURNS void AS
$BODY$
    BEGIN
    INSERT INTO users(username, firstname, lastname, password, email)
    VALUES(_username, _firstname, _lastname, _password, _email);
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
COST 100;

CREATE FUNCTION insert_votes(_user_id integer,_fact_id integer,_type integer)
RETURNS void AS
$BODY$
    BEGIN
    INSERT INTO votes(user_id, fact_id, type)
    VALUES(_user_id, _fact_id, _type);
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
COST 100;

`;