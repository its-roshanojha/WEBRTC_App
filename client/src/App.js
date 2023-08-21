import './App.css';
import { Routes, Route } from "react-router-dom";
import Lobby from './screens/Lobby';


function App() {
  return (
    <div className="App container mt-3">
      <Routes>
        <Route path="/" element={<Lobby/>} />
        {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
