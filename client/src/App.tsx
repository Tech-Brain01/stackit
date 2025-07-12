import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AskQuestion from "./pages/AskQuestion";
import AllQuestions from "./pages/ShowAllQuestions";
import NotFound from "./pages/PageNotFound";

// Common Layout (optional)
import Navbar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <main className="px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/questions" element={<AllQuestions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;