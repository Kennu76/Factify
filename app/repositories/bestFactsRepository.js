var bestFactsRepository = {
    /**
     * Retrieves [options.limit] facts with votes in last [options.days] days ordered by score;
     * 
     * @param {Object} options
     *   @param {Number} options.limit - Number of facts to retrieve;
     *   @param {Number} options.days - Number of days.
     * @param {Function} callback(result)-  callback is called after query is done
     *                                      result is array of retrieved objects or  "error" if error occurs.
     */
    get : function(options, callback){
       var query = psql.query(`SELECT fact_id, votesum, facts.fact, facts.created_at as date, users.username FROM (
                                                SELECT fact_id, sum(type) as votesum FROM votes 
                                                WHERE votes.created_at > (current_timestamp - ( $1 || ' days') :: INTERVAL )
                                                GROUP BY fact_id) 
                                                as sums
                                LEFT JOIN facts on facts.id = sums.fact_id
                                LEFT JOIN users on facts.user_id = users.id
                                ORDER BY votesum DESC
                                LIMIT $2`,
                               [options.days, options.limit]); 

       query.on("error",function(err){
           console.log(err);
           callback("error");
       });

       query.on("end", function(result){
           callback(result.rows);
       });
    }
} 

module.exports = bestFactsRepository; 