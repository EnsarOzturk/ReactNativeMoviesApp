import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Movie {
  id: number;           
  title: string;        
  poster_path: string;  
  release_date: string; 
  backdrop_path?: string; 
  overview?: string;    
  vote_average: number; 
}

interface MovieState {
  movies: Movie[];
}

const initialState: MovieState = {
  movies: [],
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
  },
});

export const { setMovies } = movieSlice.actions;
export default movieSlice.reducer;
