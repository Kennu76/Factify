var factRepository = {
    /**
     * Retrieves [options.limit] users with most votes in last [options.days] days ordered by score;
     * 
     * @param {Object} options
     *   @param {Number} options.limit - Number of users to retrieve;
     *   @param {Number} options.days - Number of days.
     * @param {Function} callback(result) - callback is called after query is done
     *                                      result is array of retrieved objects or  "error" if error occurs.
     */
    getRandom : function(callback){
       var query = psql.query(`SELECT facts.id, facts.fact, users.username, upvotes, downvotes from (SELECT fact_id, 
                                sum(case when type=-1 then 1 else 0 end) as downvotes,
                                sum(case when type=1 then 1 else 0 end) as upvotes                                
                                FROM votes 
                                GROUP BY fact_id) as votes
                                LEFT JOIN facts on fact_id = facts.id
                                LEFT JOIN users on facts.user_id = users.id
                                OFFSET floor(random() * 5)
                                LIMIT 1`);

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