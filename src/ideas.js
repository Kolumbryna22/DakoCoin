const databaseUser = require('../env.json');
const { MongoClient } = require('mongodb');
const ProvenDB = require('@southbanksoftware/provendb-node-driver');

const ProvenDB_URI = `mongodb://${databaseUser.user}:${databaseUser.password}@dako-coin.provendb.io/dako-coin?ssl=false`;
let dbObject;
let collection;
let pdb;

MongoClient.connect(ProvenDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((client) => {
    dbObject = client.db('dako-coin');
    pdb = new ProvenDB(dbObject);
    collection = pdb.collection('provenIdeas');
  })
  .catch((e) => {
    console.log('Error connecting to ProvenDB');
    console.log(e);
    process.exit();
  });

module.exports = {
  getAllIdeas: idea => {
    new Promise((resolve, reject) => {
      if (collection) {
        collection.find(idea).toArray((querryError, result) => {
          if (querryError) {
            reject(new Error('Error fetching ideas'));
          } else {
            resolve(result);
          }
        });
      }
    });
  },

  proofNewIdea: idea => {
    new Promise((resolve, reject) => {
      const newDocument = {
        idea,
        uploadDate: Date.now()
      };

      if (collection) {
        collection.insertOne(newDocument, (insertError) => {
          if (insertError) {
            reject(new Error('Error inserting document'));
          } else {
            pdb
              .submitProof()
              .then((result) => {
                console.log(result);
                resolve('New Proof created');
              })
              .catch((e) => {
                console.log(e);
                reject('Error: Could not prove new version');
              });
          }
        })
      } else {
        reject('Could not acquire collection');
      }
    });
  }
};
