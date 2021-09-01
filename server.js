const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const path = require("path");

const PORT = process.env.PORT || 3001;

const db = require("./models");
const { Router } = require("express");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/deep-thoughts',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        },
        {
            $sort: { "day": 1 }
        }
    ])
        .then((data) => {
            console.log(data);
            console.log(data[0].exercises)
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        });
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        },
        {
            $sort: { "day": -1 }
        },
        {
            $limit: 7
        }
    ])
        .then((data) => {
            console.log(data);
            console.log(data[0].exercises)
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        });
})

app.put("/api/workouts/:id", (req, res) => {
    db.Workout.updateOne(
        {
            _id: mongodb.ObjectId(req.params.id)
        },
        {
            $push: { exercises: req.body }
        }
    )
        .then((data) => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});


app.listen(PORT, () => {
    console.log("App running on port 3001!");
});

