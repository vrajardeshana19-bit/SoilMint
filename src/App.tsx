import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/pages/LandingPage';
import About from './pages/About';
import Marketplace from './pages/Marketplace';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
