module.exports = seeder;
var User = require(__base + "/models/user");
var Fact = require(__base + "/models/fact");
function seeder(){

///test kasutajad
for(var i = 0; i < 10; i++){
    var u = User.create();

    u.email = "test"+ i +"@example.com";
    u.firstname = "Test" + i;
    u.lastname = "Testija";
    u.password = User.hashPassword(String(i));
    u.username = "Test User #" + String(i);

    var save = u.save();
    save.on("error",function(result){
        console.log(result); 
    })
}

var q = global.psql.query("SELECT id from users LIMIT 1"); 
q.on("end",function(result){

var user_id = result.rows[0].id;

var fact = Fact.create();
fact.fact = "Holocaust denial group offered $50,000 to anyone who could prove that gas chambers were used to intentionally kill people at Auschwitz. They were forced by a judge to pay that money, and an additional $40,000, to Auschwitz survivor Mel Mermelstein who provided proof of that very fact." 
fact.title = "holocaust denial";
fact.user_id = user_id;
var save = fact.save();

var fact = Fact.create();
fact.fact = "In 2012 Taylor Swift held a public vote for where she would visit and preform a free concert 4chan users voted for a childrens school for the deaf and won the vote.";
fact.title = "In 2012";
fact.user_id = user_id;
var save = fact.save();

var fact = Fact.create();
fact.fact = "In Saudi Arabia women are not allowed to drive, Saudi Arabia has the highest road accident death toll in the world.";
fact.title = "In 2012";
fact.user_id = user_id;
var save = fact.save();


for(var i = 0; i < 10; i++){

    var fact = Fact.create();
    fact.fact = "Random fact with no content #" + i;
    fact.title = "random";
    fact.user_id = user_id;
    var save = fact.save();
}
});










}