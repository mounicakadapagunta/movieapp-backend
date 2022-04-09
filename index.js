// const express = require("express");// "type':"commonjs"
import express from "express"; //"type":"module"
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { moviesRouter } from "./routes/movies.js"

dotenv.config();
export const app = express();

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
export const client = await createConnection(); //calling the function

//matching the paths 
app.get("/", (request, response) => {
    response.send("Hey amigos!!");
});
app.use("/movies", moviesRouter)

app.listen(PORT, () =>
    console.log("App is started in ", PORT));



