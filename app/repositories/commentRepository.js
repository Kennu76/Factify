var commentsRepository = {
    /**
     * Retrieves [options.limit] users with most votes in last [options.days] days ordered by score;
     * 
     * @param {Object} options
     *   @param {Number} options.limit - Number of users to retrieve;
     *   @param {Number} options.days - Number of days.
     * @param {Function} callback(result) - callback is called after query is done
     *                                      result is array of retrieved objects or  "error" if error occurs.
     */
    get : function(fact_id, callback){
       var query = psql.query(`select comments.id, comment, users.username from comments
                                left join users on
                                comments.user_id = users.id
                                where fact_id = $1;`,
                               [fact_id]); 

       query.on("error",function(err){
           console.log(err);
           callback("error");
       });

       query.on("end", function(result){
           callback(result.rows);
       });
    }
} 

module.exports = commentsRepository; 