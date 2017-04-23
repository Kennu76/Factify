var factRepository = {
    /**
     * Retrives random fact from the repository 
     * 
     * @param {Function} callback(result) - callback is called after query is done
     *                                      result is array of retrieved objects or  "error" if error occurs.
     */
    getRandom : function(callback){
       var query = psql.query(`SELECT facts.id as fact_id, users.username, facts.fact as fact, users.id as user_id, 
                                (case when votes.downvotes is null then 0 else votes.downvotes end) as downvotes,
                                (case when votes.upvotes is null then 0 else votes.upvotes end) as upvotes 
                                from facts
                                LEFT JOIN (SELECT fact_id, 
                                        sum(case when type=-1 then 1 else 0 end) as downvotes,
                                        sum(case when type=1 then 1 else 0 end) as upvotes                                
                                        FROM votes 
                                        GROUP BY fact_id) 
                                as votes 
                                on votes.fact_id = facts.id
                                LEFT JOIN users on facts.user_id = users.id
                                OFFSET floor((select count(*) from facts) * random())
                                LIMIT 1`);

       query.on("error",function(err){
           console.log(err);
           callback("error");
       });

       query.on("end", function(result){
           callback(result.rows[0]);
       });
    },
    /**
     * Retrives fact from the repository by id with vote counts
     * 
     * @param {Function} callback(result) - callback is called after query is done
     *                                      result is array of retrieved objects or  "error" if error occurs.
     */
    get : function(id, callback){
       var query = psql.query(`SELECT facts.id as fact_id, users.username, facts.fact as fact, users.id as user_id, 
                                (case when votes.downvotes is null then 0 else votes.downvotes end) as downvotes,
                                (case when votes.upvotes is null then 0 else votes.upvotes end) as upvotes 
                                from facts
                                LEFT JOIN (SELECT fact_id, 
                                        sum(case when type=-1 then 1 else 0 end) as downvotes,
                                        sum(case when type=1 then 1 else 0 end) as upvotes                                
                                        FROM votes 
                                        GROUP BY fact_id) 
                                as votes 
                                on votes.fact_id = facts.id
                                LEFT JOIN users on facts.user_id = users.id
                                WHERE facts.id = $1
                                LIMIT 1`, [id]);

       query.on("error",function(err){
           console.log(err);
           callback("error");
       });

       query.on("end", function(result){
           callback(result.rows[0]);
       });
    }
} 

module.exports = factRepository; 