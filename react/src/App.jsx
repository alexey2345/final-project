import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
import About from "./pages/about";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import NewCard from "./pages/newCard";
import MyCards from "./components/cards/myCards";
import FavoritesPage from "./pages/favorites";
import NavBar from "./components/navbar";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [isNightMode, setIsNightMode] = useState(false); // State for night mode

  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`app min-vh-100 d-flex flex-column gap-2 ${
        isNightMode
          ? "bg-secondary text-warning"
          : "bg-light text-danger-emphasis"
      }`}
    >
      {/* Pass toggleNightMode and isNightMode to NavBar */}
      <NavBar
        setSearch={setSearch}
        toggleNightMode={toggleNightMode}
        isNightMode={isNightMode}
      />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home searchValue={search} />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/new-card" element={<NewCard />} />
          <Route path="/my-cards" element={<MyCards />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
