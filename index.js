// const express = require("express");// "type':"commonjs"
import express from "express"; //"type":"module"
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = 5000;

//Middleware
app.use(express.json());
//every request in the app body is parsed as json

//mongodb connection settings
const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect(); //returns a promise object
    console.log("mongodb connected successfully");
    return client;
}
const client = await createConnection(); //calling the function

//matching the paths 
app.get("/", (request, response) => {
    response.send("Hey amigos!!");
});

app.get("/movies", async (request, response) => {
    //request-> query params
    console.log(request.query);
    //to filter the movie as per condition
    const filter = request.query;
    console.log(filter)
    if (filter.rating) {
        filter.rating = +filter.rating
    }

    const filterMovies = await getMovies()
    response.send(filterMovies);
});
app.post("/movies", async (request, response) => {
    const data = request.body;
    //console.log(data);
    const result = await createMovies(data);
    response.send(result);
})

// to get movie by id 
app.get("/movies/:id", async (request, response) => {
    console.log(request.params);
    const { id } = request.params;
    const movie = await getMovieById(id)
    // const movie = movies.find((mv) => mv.id === id);
    console.log(movie);
    movie
        ? response.send(movie)
        : response.status(404)
            .send({ message: "No matching movie found" });
});

//to delete movie
app.delete("/movies/:id", async (request, response) => {
    console.log(request.params);
    const { id } = request.params;
    const result = await deleteMovieById(id);
    result.deletedCount > 0
        ? response.send(result)
        : response.status(404)
            .send({ message: "No matching movie found" });
});
//to update the movie list
app.put("/movies/:id", async (request, response) => {
    console.log(request.params);
    const { id } = request.params;

    const data = request.body;
    const result = await updateMovieById(id, data);
    const movie = await getMovieById(id)

});

app.listen(PORT, () =>
    console.log("App is started in ", PORT));


async function updateMovieById(id, data) {
    return await client
        .db("b28wd")
        .collection("movies")
        .updateOne({ id: id }, { $set: data });
}

async function createMovies(data) {
    return await client
        .db("b28wd")
        .collection("movies")
        .insertMany(data);
}

async function getMovies() {
    return await client
        .db("b28wd")
        .collection("movies")
        .find({})
        .toArray();
}

async function deleteMovieById(id) {
    return await client
        .db("b28wd")
        .collection("movies")
        .deleteOne({ id: id });
}

async function getMovieById(id) {
    return await client
        .db("b28wd")
        .collection("movies")
        .findOne({ id: id });
}

