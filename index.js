const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, client) => { // Remove useNewUrlParser option
            if (err) {
                reject(err);
                return;
            }

            const db = client.db("mydb");
            const collection = db.collection('customers');
            const cursor = collection.find({}).limit(10);

            cursor.toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs);
                client.close(); // Close the client after query completion
            });
        });
    });
}

setTimeout(() => {
    findAll()
        .then(docs => {
            console.log(docs);
        })
        .catch(err => {
            console.error(err);
        });
}, 5000);
