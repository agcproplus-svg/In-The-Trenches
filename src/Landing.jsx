import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import nflLogo from "./assets/logos/nfl.png"; // placeholder NFL shield

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <motion.img
        src={nflLogo}
        alt="NFL Logo"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="w-32 h-32 mb-6"
      />
      <motion.h1
        className="text-5xl font-extrabold tracking-widest mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        In the Trenches
      </motion.h1>
      <motion.button
        onClick={() => navigate("/game")}
        className="px-8 py-4 bg-red-600 rounded-2xl text-xl font-bold shadow-lg hover:bg-red-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Game
      </motion.button>
    </div>
  );
}
