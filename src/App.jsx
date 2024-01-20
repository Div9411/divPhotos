import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Homepage from "./pages/Homepage";
import Results from "./pages/Results";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import HistoryPage from "./components/HistoryPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/results" element={<Results />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/history/:id" element={<HistoryPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 2000 },
          error: { duration: 3000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "red",
            color: "white",
          },
        }}
      />
    </>
  );
}

export default App;
