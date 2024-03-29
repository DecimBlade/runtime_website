import React, { useContext, useState } from 'react';
import axios from 'axios';
import MovieCard2 from './MovieCard2';
import { WatchlistContext } from "../../pages/auth/contexts/WatchlistState";
import AddToWatchlistButton from './AddToWatchlistButton';
import "./MovieSearch2.css"


const API_KEY = '02949da4b2212ad21636aad608287a04';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { addMovieToWatchlist, watchlist } = useContext(WatchlistContext);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setQuery(value);

    // make API call to search for movies when user types at least 3 characters
    if (value.length >= 3) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${value}`
      );
      setResults(response.data.results);
    } else {
      // clear results if query is empty or less than 3 characters
      setResults([]);
    }
  };

  return (
    <div className="flex-rows items-center py-10 text-center text-5xl text-teal-400 dark:text-teal-400 space-y-5">
      <p
      // style={{
      //   position: 'flex',
      //   alignSelf: 'center',
      //   right: '300px',
      // }
      // }
      >Find Movies</p>
      <form>
      <input
        className="rounded-full text-white placeholder-white"
        type="text"
        placeholder="Search for a movie"
        value={query}
        onChange={handleInputChange}
        style={{
          backgroundColor: '#5e76cc',
          text: '#ffffff',
          width: '500px',
          height: '70px',
          fontSize: '24px',
          padding: '10px',
          borderRadius: '25px',
          border: 'none',
          outline: 'none',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          alignSelf: 'left',
          placeholderColor: '#ffffff',
        }}
      />

      </form>
      {results.length > 0 && (
        <div className="movie-list">
          {results.map((movie) => (
            <div className = "movie-item">
              <MovieCard2
                key={movie.id}
                posterPath={movie.poster_path}
                title={movie.title}
                releaseDate={movie.release_date}
              />
              <AddToWatchlistButton movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default MovieSearch;
