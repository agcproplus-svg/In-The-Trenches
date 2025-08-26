import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Game from "./Game"; // existing game component

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </HashRouter>
  );
}
