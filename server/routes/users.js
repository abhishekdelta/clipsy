var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

var createId = function(collection, callback){
	// Make sure userid s are always strings.
	var userid = (Math.round(Math.random() * 100000000)).toString();
	collection.findOne({userid: userid}, function(user) {
         if (user == null) {
         	collection.save({userid: userid, clipids: []}, function(err, count){
         		if(!err) {
         			console.log('Userid: ' + userid + 'saved successfully');
         			callback(userid);
         		}
         	});
         } else {
         	console.log("Calling createId again!");
         	createId(collection, callback);
         }
	});
}

exports.adduser = function(req, res) {
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err) throw err;
		var collection = db.collection('users');
        createId(collection, function(userid){
        	db.close();
        	res.send(userid);
        });
	});
};
