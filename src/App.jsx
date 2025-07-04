import React, { useEffect, useState} from 'react'
import Search from "./components/search.jsx";
import Spinner from "./components/spinner.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS= {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}





const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errormessage, setErrormessage] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    
    const fetchMovies = async () => {
        setIsLoading(true);
        setErrormessage('');

        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('failed to fetch movies');
            }
            const data = await response.json();

            if (data.Response === 'False') {
                setErrormessage(data.error || 'failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

        } catch (error) {
            console.log(`error fetching movies: ${error}`);
            setErrormessage('error fetching movies try again later');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();

    }, []);




    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>
                        Find <span className="text-gradient">Movies</span> You Will Enjoy Without the Hassle
                    </h1>
                 <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2 className='mt-[20px]'>All Movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ):errormessage ? (
                        <p className="text-red-500">{errormessage}</p>
                    ):(
                        <ul>
                            {movieList.map((movie) => (
                                <p key={movie.id} className="text-white"> {movie.title}</p>
                            ))}
                        </ul>
                    )
                    }
                </section>




            </div>
        </main>
    )
}
export default App
