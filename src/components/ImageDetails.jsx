import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { addRow } from "../service/History";
import { getSession } from "../service/apiAuth";

function ImageDetails({ onClose, sessionId }) {
  const [selectedResolution, setSelectedResolution] = useState("original");
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(sessionId);
  const resolutions = ["original", "large", "small"];
  const [dataImages, setDataImage] = useSearchParams();

  let isOpen = dataImages.get("isOpen");
  let imageId = dataImages.get("imageId");
  let imageUrl = dataImages.get("imageUrl");
  let imageName = dataImages.get("imageName");
  let photographer = dataImages.get("photographer");
  let likes = dataImages.get("likes");
  let comments = dataImages.get("comments");
  let smallImage = dataImages.get("smallImage");
  let largeImage = dataImages.get("largeImage");

  const modalRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [userData, setUserData] = useState(null);
  //for getting session details
  useEffect(function () {
    async function fetchSession() {
      const user = await getSession();
      setUserData(user.role);
      setUserID(user.id);
    }

    fetchSession();
  }, []);

  useEffect(() => {
    // Reset loading state when comp. mounts
    setIsLoading(true);
    setImageLoaded(false);

    // Reset loading state when image change
    if (imageUrl !== dataImages.get("imageUrl")) {
      setIsLoading(true);
      setImageLoaded(false);
    }
  }, [imageUrl, dataImages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  if (!isOpen) {
    return null;
  }

  const handleDownload = () => {
    let downloadUrl = "";
    if (selectedResolution === "large") {
      downloadUrl = `${largeImage}`;
    } else if (selectedResolution === "small") {
      downloadUrl = `${smallImage}`;
    } else {
      downloadUrl = `${imageUrl}`;
    }

    fetch(downloadUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${imageName}_${imageId}_${selectedResolution}.jpg`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addRow(userID, downloadUrl); //adding row data in supabase for history
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
        <div
          ref={modalRef}
          className="max-w-4xl mx-8 bg-white p-8 rounded-md shadow-lg overflow-hidden"
        >
          <button
            className="absolute top-4 right-4 text-gray-500"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <img
            src={imageUrl}
            alt={imageName}
            className={`w-full h-80 object-cover rounded-md mb-6 ${
              imageLoaded ? "block" : "hidden"
            }`}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && <h3>Loading image...</h3>}
          <h2 className="text-3xl font-semibold mb-4">{imageName}</h2>

          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex justify-center items-center border p-4 rounded-full bg-blue-500">
              <p className="text-gray-300 mb-2">ID: {imageId}</p>
            </div>
            <div className="flex justify-center items-center border p-4 rounded-full bg-gray-800">
              <p className="text-gray-300 mb-2">By: {photographer}</p>
            </div>
            <div className="flex justify-center items-center border p-4 bg-red-500 font-normal rounded-full hidden sm:flex">
              <p className="text-gray-300 mb-2 flex items-center">
                <span>Likes: {likes} </span>
              </p>
            </div>
            <div className="flex justify-center items-center border p-4 bg-green-500 rounded-full hidden sm:flex">
              <p className="text-gray-300 mb-2 flex items-center">
                <span>Comments: {comments}</span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 font-medium">Available Resolutions:</p>
            <select
              value={selectedResolution}
              onChange={(e) => setSelectedResolution(e.target.value)}
            >
              {resolutions.map((resolution) => (
                <option key={resolution} value={resolution}>
                  {resolution}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-green-700 text-white px-6 py-3 rounded-3xl"
            onClick={handleDownload}
          >
            Download {selectedResolution}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageDetails;
