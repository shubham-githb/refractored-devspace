const mongoose = require("mongoose");
// const User = require('../schemas/UserSchema');
// mongoose.set('useNewUrlParser', true);
// mongoose.set('userNewUrlParser',true)

class Database {

    constructor () {
        this.connect();
    }

    connect()
     {
        mongoose.connect("mongodb://shubham:20lZu5uATfqqr7uc@clusterog-shard-00-00.h0ilj.mongodb.net:27017,clusterog-shard-00-01.h0ilj.mongodb.net:27017,clusterog-shard-00-02.h0ilj.mongodb.net:27017/users?ssl=true&replicaSet=atlas-yoi750-shard-0&authSource=admin&retryWrites=true&w=majority")
        .then(()=>{
            console.log("DB DONE")
            // console.log(User)
        })
        .catch((err)=>{
            console.log("DB NOT DONE" + err);
        })
    }
}

module.exports = new Database();