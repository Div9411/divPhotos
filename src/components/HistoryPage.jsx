import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { readAll } from "../service/History";
import Loader from "./Loader";

function HistoryPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useParams();

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);
      const res = await readAll(sessionId.id);
      setData(res);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  function handleClick(downloadUrl, id) {
    fetch(downloadUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Image${id}.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  }

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="container mx-auto mt-8">
          <h1 className="text-4xl font-extrabold mb-4 ml-4">History</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.length === 0 ? (
              <div className="text-xl font-medium ml-4">
                You have downloaded zero photos.
              </div>
            ) : (
              data.map((item) => (
                <div key={item.id} className="p-4 border rounded-md">
                  <img
                    src={item.imageLink}
                    alt={`History Image ${item.id}`}
                    className="w-full h-40 object-cover mb-4 rounded-md"
                  />
                  <p
                    className="text-blue-800 font-medium text-sm cursor-pointer"
                    onClick={() => handleClick(item.imageLink, item.id)}
                  >
                    Download Again
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default HistoryPage;
