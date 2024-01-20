import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-300 to-red-900 text-white">
      <img
        src="https://cdn.pixabay.com/photo/2016/09/17/18/31/sad-1676720_1280.png"
        alt="404 Illustration"
        className="w-64 h-64 mb-8 rounded-2xl"
      />
      <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
      <p className="text-lg mb-8">
        Looks like you've ventured into uncharted territory :)
      </p>
      <Link
        to="/"
        className="font-medium text-lg underline text-blue-700 hover:text-green-500"
      >
        Go back home ↗
      </Link>
    </div>
  );
}

export default PageNotFound;
