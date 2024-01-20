import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../service/apiAuth";

let containerStyle;

function Homepage() {
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [searchquery, setSearchQuery] = useState("");
  const [dynamicImage, setDynamicImage] = useState(""); //for dynamic image
  const navigate = useNavigate();

  //object for dynamic img
  containerStyle = {
    backgroundImage: `url(${dynamicImage})`,
    backgroundSize: "cover", // Stretch and cover the container
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center", // Center the image
  };

  function handleHistory() {
    navigate(`/history/${sessionId}`);
  }

  //for getting session details
  useEffect(function () {
    async function fetchSession() {
      const user = await getSession();
      setUserData(user.role);
      setSessionId(user.id);
    }

    fetchSession();
  }, []);

  //for dynamic image
  useEffect(
    function () {
      let dynamicBackground = `https://mzfvyghqroaicmtfdisw.supabase.co/storage/v1/object/public/images/image${
        Math.floor(Math.random() * 20) + 1
      }.jpg?t=2024-01-19T18%3A07%3A34.427Z`;

      setDynamicImage(dynamicBackground);
    },
    [dynamicImage]
  );

  function handleClick() {
    navigate(`/results?searchquery=${searchquery}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      // Trigger search when Enter key is pressed
      navigate(`/results?searchquery=${searchquery}`);
    }
  }

  //for funny jokes api
  const [joke, setJoke] = useState("");

  useEffect(() => {
    // Fetch a random joke from JokeAPI
    fetch("https://v2.jokeapi.dev/joke/Programming")
      .then((response) => response.json())
      .then((data) => {
        // Setting the joke to the state
        setJoke(
          data.type === "twopart" ? `${data.setup} ${data.delivery}` : data.joke
        );
      })
      .catch((error) => {
        console.error("Error fetching joke:", error);
      });
  }, []);

  return (
    <div
      style={containerStyle}
      className="grid grid-rows-10 grid-cols-10 gap-10 h-screen"
    >
      <nav className="rounded-md m-8 row-span-2 col-span-10 bg-gray-400 border-zinc-100 bg-opacity-50 flex justify-between items-center">
        <div className="p-2 ml-3 text-white bg-green-600 rounded-3xl">
          <a href="https://divyanshsingh-surprise.netlify.app/" target="_blank">
            Click me :)
          </a>
        </div>
        <div className="flex items-center text-white">
          {userData === "authenticated" ? (
            <div className="p-3">👤</div>
          ) : (
            <Link to="/login" className="p-3">
              Login
            </Link>
          )}

          <Link
            to="/createaccount"
            className="p-2 border-2 border-zinc-400 rounded-md m-1"
          >
            Create account
          </Link>
        </div>
      </nav>
      <div className="text-white text-2xl font-medium row-start-3 row-end-4 col-start-4 col-end-9 sm:text-4xl lg:text-5xl mr-5">
        Discover over 2,000,000 free stock images
      </div>
      {userData && (
        <div className="p-5 flex justify-between items-center col-start-2 col-end-10 row-start-5 row-end-6 sm:col-start-4 sm:col-end-8 rounded-md bg-gray-400 border-zinc-100 bg-opacity-50 border-2  ">
          <span className="z-20" onClick={handleHistory}>
            <img
              className="opacity-80"
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/time-machine.png"
              alt="history"
            />
          </span>
          <input
            className="text-white bg-transparent border-zinc-100 bg-opacity-50 w-full outline-none ml-6 font-medium"
            type="text"
            placeholder="&nbsp; &nbsp; &nbsp;Search"
            value={searchquery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="px-1 text-white border-2 border-zinc-400 rounded-md "
            onClick={handleClick}
          >
            Go!
          </button>
        </div>
      )}

      {userData && (
        <div className="p-1 text-white text-sm flex items-center row-start-6 row-end-6 col-start-4 col-end-8 rounded-md sm:col-start-5 sm:col-end-7 bg-gray-400 border-zinc-100 bg-opacity-50 border-2 h-7 overflow-hidden">
          <marquee behavior="scroll" direction="left" scrollamount="4">
            <span className="mr-1">Trending:</span>
            Mountains, Cars, Beaches, Technology, Nature, Travel...
          </marquee>
        </div>
      )}

      {/* Funny Joke Section */}
      <div className="p-3 text-white text-sm flex items-center row-start-10 row-end-10 col-start-2 col-end-10 sm:col-start-4 sm:col-end-8 rounded-md bg-gray-400 border-zinc-100 bg-opacity-50 border-2 ">
        <span className="mr-1">Funny Joke:</span>
        <marquee behavior="scroll" direction="left" scrollamount="8">
          {joke || "Loading funny joke..."}
        </marquee>
      </div>
    </div>
  );
}

export default Homepage;
