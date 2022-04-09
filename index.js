// const express = require("express");// "type':"commonjs"
import express from "express"; //"type":"module"
import { MongoClient } from "mongodb";
const app = express();

const PORT = 5000;
//middleware
app.use(express.json());
//every request in the app body is parsed as json

//mongodb connection settings
const MONGO_URL = "mongodb+srv://gautham:gautham@blog.jcckq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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
    // const { language, rating } = request.query
    // console.log(language, rating);
    // let filterMovies = movies
    // if (language) {
    //     filterMovies = movies.filter((mv) =>
    //         mv.language === language);
    // }
    // if (rating) {
    //     filterMovies = movies.filter((mv) =>
    //         mv.rating === +rating);
    // }
    const filterMovies = await client
        .db("b28wd")
        .collection("movies")
        .find({})
    response.send(filterMovies);
});
app.post("/movies", async (request, response) => {
    const data = request.body;
    console.log(data);
    response.send(data);
})

app.get("/movies/:id", async (request, response) => {
    console.log(request.params);
    const { id } = request.params;

    const movie = await client
        .db("b28wd")
        .collection("movies")
        .findOne({ id: id })
    // const movie = movies.find((mv) => mv.id === id);
    console.log(movie);
    //when there is no movie matching with the id 
    // display no matching movies on the screen 
    movie
        ? response.send(movie)
        : response.status(404)
            .send({ message: "No matching movie found" });
});

app.listen(PORT, () =>
    console.log("App is started in ", PORT));
