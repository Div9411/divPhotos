import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ImageDetails from "../components/ImageDetails";
import Loader from "../components/Loader";
import { getSession, logout } from "../service/apiAuth";

function Results() {
  const [backgroundImage, setBackgroundImage] = useState(
    "https://cdn.pixabay.com/photo/2022/08/31/16/22/silhouette-7423726_1280.jpg"
  );

  const [sessionId, setSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userData, setUserData] = useState(null); // for getting session detail

  const [dataImage, setDataImage] = useSearchParams();
  const searchquery = dataImage.get("searchquery");
  const navigate = useNavigate();

  const openImageDetails = (
    imageId,
    imageUrl,
    imageName,
    photographer,
    likes,
    comments,
    smallImage,
    largeImage
  ) => {
    setDataImage({
      searchquery: searchTerm,
      isOpen: true,
      imageId,
      imageUrl,
      imageName: imageName.split(",")[0].trim(),
      photographer,
      likes,
      comments,
      smallImage,
      largeImage,
    });
  }; //for changing search query data

  const closeImageDetails = () => {
    setDataImage({ searchquery: searchTerm });
  };

  const handleSearch = (query, page = 1) => {
    setIsLoading(true);
    const apiKey = "41880385-583c3ceb891b49d9224edc76f";
    const imagesPerPage = 20;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&page=${page}&per_page=${
      3 * imagesPerPage
    }&safesearch=true`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBackgroundImage(
          data.hits[Math.floor(Math.random() * data.hits.length)].webformatURL
        );
        setImages(data.hits);
        setTotalPages(Math.ceil(data.totalHits / imagesPerPage));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setIsLoading(false);
        setImages([]);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      handleSearch(searchTerm, nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" }); //for going top page
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      handleSearch(searchTerm, prevPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page to 1 when submitting a new search
    handleSearch(searchTerm);
    setDataImage({ searchquery: searchTerm });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setCurrentPage(1); // Reset page to 1 when clicking a suggestion
    handleSearch(suggestion);
    setDataImage({ searchquery: suggestion });
  };

  function handleLogout() {
    logout();
    navigate("/");
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

  useEffect(() => {
    if (searchquery) {
      setSearchTerm(searchquery);
      setCurrentPage(1); // Reset page to 1 when loading from location state
      handleSearch(searchquery);
    }
  }, [searchquery]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Search section */}
      <div
        className="bg-cover bg-center h-80 flex"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="container mx-auto text-center text-white">
          {/* Top Section */}
          <div className="flex justify-start items-center p-4 bg-opacity-5">
            {!userData ? (
              <Link
                to="/login"
                className="border-2 border-green-900 bg-green-500 rounded-full text-sm"
              >
                <img
                  className="rounded-3xl "
                  src="https://mzfvyghqroaicmtfdisw.supabase.co/storage/v1/object/public/userImage/icons8-circled-user-female-skin-type-6.gif?t=2024-01-20T16%3A30%3A43.500Z"
                  alt="login"
                  width="32"
                  height="32"
                />
              </Link>
            ) : (
              <div
                onClick={handleLogout}
                className="cursor-pointer p-2 ml-2 border-2 border-red-900 bg-red-500 rounded-3xl font-semibold text-sm"
              >
                Logout
              </div>
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-4">
            Discover High-Quality Images
          </h1>
          {userData && (
            <form className="mt-6 flex justify-center" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search for images"
                className="w-64 p-2 bg-gray-700 opacity-70 rounded-l-md outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-700 opacity-70 text-white p-2 rounded-r-md"
              >
                Go!
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="container mx-auto md:mx-10 mt-8 p-4">
        <p className="text-lg font-medium mb-4">Explore by category:</p>
        <div className="flex flex-wrap gap-4">
          {[
            "Vertical",
            "Design",
            "Technology",
            "Travel",
            "Animals",
            "Shapes",
            "Mountains",
            "Anime",
            "Cars",
            "Minimalistic",
            "Superhero",
            "Abstract",
          ].map((suggestion, index) => (
            <div
              key={index}
              className="bg-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-300"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="containerGrid">
        {isLoading && <Loader />}

        {images.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            <p>No images found. Please try again.</p>
          </div>
        )}

        {images.map((image, index) => (
          <div
            key={index}
            className="box"
            onClick={() =>
              openImageDetails(
                image.id,
                image.largeImageURL,
                image.tags,
                image.user,
                image.likes,
                image.comments,
                image.previewURL,
                image.webformatURL
              )
            }
          >
            <img src={image.webformatURL} alt={image.tags} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center py-6">
        <button
          className="mr-2 px-4 py-2 bg-gray-700 text-white rounded"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="ml-2 px-4 py-2 bg-gray-700 text-white rounded"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Image Details Modal */}
      <ImageDetails onClose={closeImageDetails} sessionId={sessionId} />
    </div>
  );
}

export default Results;
