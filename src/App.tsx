import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterInfo from './pages/EnterInfo';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Ranking from './pages/Ranking';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterInfo />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
};

export default App;
