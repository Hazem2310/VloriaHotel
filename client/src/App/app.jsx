import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Home from "../pages/home/Home";
import Header from "../components/header/Header";
import Contact from "../pages/ContactUs/ContactUs";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
