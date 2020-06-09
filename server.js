var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var USERS_COLLECTION = "users";
var RISK_COLLECTION = "risk_score";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const uri = "mongodb+srv://root:root@cluster0-wmgrf.mongodb.net/test?retryWrites=true&w=majority";
debugger
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
  var myobj = [
    { riskcode: "1", riskscore: 5 },
    { riskcode: "2", riskscore: 6 },
    { riskcode: "3", riskscore: 6 },
    { riskcode: "4", riskscore: 7 },
    { riskcode: "5", riskscore: 6 }
  ];
  var flag;
  db.listCollections().toArray(function (err, collections) {
    flag = collections.find(obj => obj.name == 'risk_score')
    if (!flag) {
      db.collection("risk_score").insertMany(myobj, function (err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        // db.close();
      });
    }
  });

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

/*  "/api/user"
 *    GET: finds all user
 *    POST: creates a new contact
 */

app.get("/api/user", function (req, res) {
  db.collection(USERS_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get user.");
    } else {
      res.status(200).json(docs);
    }
  });
});


app.post("/api/user", function (req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    db.collection(USERS_COLLECTION).insertOne(newContact, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/user/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/user/:id", function (req, res) {
  db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/api/user/riskscore/:id", function (req, res) {
  db.collection('risk_score').findOne({ riskcode: req.params.id }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get Risk Score");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/user/:id", function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(USERS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, { $set: updateDoc },
    { upsert: true }, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update contact");
      } else {
        updateDoc._id = req.params.id;
        res.status(200).json(updateDoc);
      }
    });
});

app.delete("/api/user/:id", function (req, res) {
  db.collection(USERS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
