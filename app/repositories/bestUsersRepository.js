var bestUsersRepository = {
    /**
     * Retrieves [options.limit] users with most votes in last [options.days] days ordered by score;
     * 
     * @param {Object} options
     *   @param {Number} options.limit - Number of users to retrieve;
     *   @param {Number} options.days - Number of days.
     * @param {Function} callback(result) - result is array of retrieved objects or  "error" if error occurs.
     */
    get : function(options, callback){
       var query = psql.query(`SELECT username, count(facts.id) as factCount, sum(votes.type) as votesum from users
                               JOIN facts on users.id = facts.user_id
                               JOIN votes on facts.id = votes.fact_id
                               WHERE votes.created_at > (current_timestamp - ( $1 || ' days') :: INTERVAL )
                               GROUP BY username
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

module.exports = bestUsersRepository; 