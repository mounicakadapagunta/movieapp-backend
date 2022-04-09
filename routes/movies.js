import { getMovies, createMovies, getMovieById, deleteMovieById, updateMovieById } from "../helper.js";
import express from "express";
const router = express.Router();
router
    .route("/")
    .get(async (request, response) => {
        //request-> query params
        console.log(request.query);
        //to filter the movie as per condition
        const filter = request.query;
        console.log(filter);
        if (filter.rating) {
            filter.rating = +filter.rating;
        }

        const filterMovies = await getMovies();
        response.send(filterMovies);
    })
    .post(async (request, response) => {
        const data = request.body;
        //console.log(data);
        const result = await createMovies(data);
        response.send(result);
    });
// to get movie by id 
router
    .route("/:id")
    .get(async (request, response) => {
        console.log(request.params);
        const { id } = request.params;
        const movie = await getMovieById(id);
        // const movie = movies.find((mv) => mv.id === id);
        console.log(movie);
        movie
            ? response.send(movie)
            : response.status(404)
                .send({ message: "No matching movie found" });
    })
    //to delete movie
    .delete(async (request, response) => {
        console.log(request.params);
        const { id } = request.params;
        const result = await deleteMovieById(id);
        result.deletedCount > 0
            ? response.send(result)
            : response.status(404)
                .send({ message: "No matching movie found" });
    })
    //to update the movie list
    .put(async (request, response) => {
        console.log(request.params);
        const { id } = request.params;

        const data = request.body;
        const result = await updateMovieById(id, data);
        const movie = await getMovieById(id);

    });

export const moviesRouter = router;