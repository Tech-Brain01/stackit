import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/PageNotFound";

// Common Layout (optional)
import Navbar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;