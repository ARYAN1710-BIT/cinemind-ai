import HeroBanner from "../components/HeroBanner";
import TrendingMovies from "../components/TrendingMovies";
import PopularMovies from "../components/PopularMovies";
import TopRatedMovies from "../components/TopRatedMovies";
import UpcomingMovies from "../components/UpcomingMovies";

function Home() {
  return (
    <div className="home">
      <HeroBanner />
      <TrendingMovies />
      <PopularMovies />
      <TopRatedMovies />
      <UpcomingMovies />
    </div>
  );
}

export default Home;