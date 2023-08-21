import './App.css';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={'HI'} />
        {/* <Route path="/room/:roomId" element={<RoomPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
