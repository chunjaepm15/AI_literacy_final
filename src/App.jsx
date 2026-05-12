import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SpaceDetective from './pages/SpaceDetective';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/space-detective/*" element={<SpaceDetective />} />
      </Routes>
    </Router>
  );
}

export default App;
