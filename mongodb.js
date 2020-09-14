const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');
const id = (identifier) => {
    return new ObjectID(identifier)
}

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Use connect method to connect to the Server
MongoClient.connect(url, (err, client) => {
    assert.strictEqual(null, err);
    const db = client.db("taskmanager");
    // db.collection('users').insertOne({
    //     id: 6,
    //     name: 'Rabail Kaghzi',
    //     city: 'Sukkur'
    // }, (error, result)=>{
    //     if(error){
    //         console.log(error)
    //     } else {
    //         console.log(result.ops)
    //     }
    // })
    // .then(function (result) {
    //     // process result
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         name: 'reading',
    //         completed: false
    //     },
    //     {
    //         name: 'math',
    //         completed: true
    //     },
    //     {
    //         name: 'drawing',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         console.log(error)
    //     } else {
    //         console.log(result.ops)
    //     }
    // })
    // db.collection('users').findOne({name: 'Khadija Bano'}, (error, result)=>{
    //     if(error){
    //         console.error('Error: ' + error)
    //     } else if (result === null){
    //         console.warn('Warning: ' + result)
    //     } else {
    //         console.log(result)
    //     }
    // })
    // db.collection('users').findOne({id: 6}, (error, result)=>{
    //     if(error){
    //         console.error('Error: ' + error)
    //     } else if (result === null){
    //         console.warn('Warning: ' + result)
    //     } else {
    //         console.log(result)
    //     }
    // })

    // db.collection('users').findOne({name: 'Sara'}, (error, result)=>{
    //     if(error){
    //         console.error('Error: ' + error)
    //     } else if (result === null){
    //         console.warn('Warning: ' + result)
    //     } else {
    //         console.log(result)
    //     }
    // })
    // db.collection('users').findOne({_id: new ObjectID("5f4f462ee8830ad0bf1023c2")}, (error, result)=>{
    //     if(error){
    //         console.error('Error: ' + error)
    //     } else if (result === null){
    //         console.warn('Warning: ' + result)
    //     } else {
    //         console.log(result)
    //     }
    // })
    //
    // db.collection('users').findOne({_id: id("5f4f48d0122168d0ff2a61b0")}, (error, result)=>{
    //     if(error){
    //         console.error('Error: ' + error)
    //     } else if (result === null){
    //         console.warn('Warning: ' + result)
    //     } else {
    //         console.log(result)
    //     }
    // })

    // db.collection('users').find({city: 'Edmonton'}).toArray((error, users) => {
    //     if (error) {
    //         return console.error(error)
    //     }
    //     console.log(users)
    // })
    //
    // db.collection('users').find({city: 'Edmonton'}).count((error, count) => {
    //     if (error) {
    //         return console.error(error)
    //     }
    //     console.log(count)
    // })

    // db.collection('users').updateOne({id: 6},
    //     {
    //         $set:
    //             {
    //                 city: 'Sukkur'
    //             }
    //     }
    // ).then(
    //     (result) => {
    //         console.log('result: '+ result)
    //     }
    // ).catch((error) => {
    //     console.error('Error: ' + error)
    // })

    // try{
    //     db.collection('tasks').updateMany(
    //         {completed: true},
    //         {
    //             $set: {
    //                 completed: false
    //             }
    //         }
    //     ).then((result) => {
    //         console.log('Result:')
    //         console.log(result.result);
    //     }
    //     ).catch((error)=>{
    //         console.log(error);
    //     })
    // } catch(e){
    //     console.log('Error: ' + e);
    // }

    // db.collection('tasks').deleteOne({
    //     name: 'reading'
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // })

    client.close();

});
// akaghzi
// lRvXfcnzVqwt0ZQd
// mongodb+srv://akaghzi:<password>@cluster0.jyt1w.mongodb.net/<dbname>?retryWrites=true&w=majority