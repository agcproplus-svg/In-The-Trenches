import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Game from "./Game"; // existing game component

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
