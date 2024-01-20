function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="border-8 border-white border-t-gray-500 rounded-full w-16 h-16 animate-spin"></div>
        <div className="mt-2 text-white font-bold">Loading...</div>
      </div>
    </div>
  );
}

export default Loader;
