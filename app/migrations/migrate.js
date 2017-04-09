/** script to manage and sync databases  */
var pg = require('pg');
var glob = require('glob');
var path = require('path');
var psqlClient;
pg.defaults.ssl = process.env.DB_SSL != "false";

pg.connect(process.env.DATABASE_URL, function(err, pqClient) {
  if (err) throw err;
  psqlClient = pqClient;

  getMigrationLevel(function(migrationLevel){
      runMigrations(migrationLevel);
  });

});

var getMigrationLevel = function(callback){
    var query = psqlClient.query("SELECT value FROM options WHERE option = 'migrationLevel'");

    query.on('end', function(result){
        if(result.rowCount === 0){
            migrationLevel='00000';
        }
        else{
           migrationLevel = result.rows[0].value; 
        }
        callback(migrationLevel);
    });

    query.on('error', function(result){
        migrationLevel='0000';
        callback(migrationLevel);
    });
}

var runMigrations = function(migrationLevel){

    glob(path.join(__dirname + "/*"), {ignore: [path.join(__dirname + "/migrate.js")]}, function(err,files){
        workFiles(files,0, function(){
            console.log('Migrations done');
            process.exit();
        },migrationLevel);        
    });
    
};

var workFiles = function(files, cur, next, migrationLevel){
    if(cur === files.length || cur > files.length){
        next();
        return;
    }
    if(files[cur] < migrationLevel){
        console.log("Skipped file " + files[cur]);
        workFiles(files,cur+1,next,migrationLevel);
        return;
    }
    runQuery(files[cur], function(){workFiles(files, cur+1, next, migrationLevel)});
}

var runQuery = function(file, next){
     console.log("Migrationfile: " + file + "\n");

     var sql = require(file);
     console.log(sql);

     var query = psqlClient.query(sql);

     query.on('error', function(err){
         console.log("Something went wrong: ");
         console.log(err);
         console.log("Trying to continue..");
         next();
     });

     query.on('end', function(row){
         var iq = psqlClient.query("UPDATE options SET value = $1 WHERE option = 'migrationLevel'", [file]);

         iq.on('end',function(){
             next();
         });

     });
}