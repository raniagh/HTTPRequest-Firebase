import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  /* //handle promise with then()
  function fetchMoviesHandler() {
    fetch("https://swapi.dev/api/films")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const transformedMovies = data.results.map((movie) => {
          return {
            id: movie.episode_id,
            title: movie.title,
            openingText: movie.opening_crawl,
            releaseDate: movie.release_date,
          };
        });
        setMovies(transformedMovies);
      });
  } */

  //handle promise with Async/await
  //useCallback ensure that we run
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    //HTTP request return a promise we should wait the response to continue working with
    try {
      //get movies using Firebase API
      const response = await fetch(
        "https://react-http-79508-default-rtdb.firebaseio.com/movies.json"
      );
      //Or using Swapi API
      //const response = await fetch("https://swapi.dev/api/films");

      //Axios throw error messages automatically but with fetch we should throw manually
      if (!response.ok) {
        throw new Error("Something Went wrong!");
      }
      //wait for the transformation from json to JS object
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
      //Using SWAPI
      /* const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(transformedMovies); */
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  });

  useEffect(() => {
    fetchMoviesHandler();
  }, []);

  const addMovieHandler = async (movie) => {
    await fetch(
      "https://react-http-79508-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        //convert JS object to json format
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
  let content = <p>Found No Movies </p>;
  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;
  if (isLoading) content = <p>Loading...</p>;
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
