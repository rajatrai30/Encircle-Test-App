import { useStore } from "./zustand/store";
import { Navigate, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { StartChatPage } from "./pages/StartChatPage";
import { Navbar } from "./components/Navbar/Navbar";
import { JoinChatCopy } from "./components/JoinChat/JoinChatCopy";
import { JoinChat } from "./components/JoinChat/JoinChat";
import "./App.css";

function App() {
  const chat = useStore((state) => state.chat);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            chat ? <Navigate to="/chat" /> : <Navigate to="/startIcon" />
          }
        />
        <Route
          path="/startIcon"
          element={chat ? <Navigate to="/chat" /> : <JoinChatCopy />}
        />
        <Route
          path="/start"
          element={chat ? <Navigate to="/chat" /> : <StartChatPage />}
        />
        <Route
          path="/start/:serviceName"
          element={chat ? <Navigate to="/chat" /> : <JoinChat />}
        />
        <Route
          path="/chat"
          element={chat ? <ChatPage /> : <Navigate to="/startIcon" />}
        />
      </Routes>
      {/* <Routes>
				<Route
					path="/"
					element={user ? <Navigate to="/start" /> : <Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={user ? <Navigate to="/start" /> : <Welcome />}
				/>
				<Route
					path="/start"
					element={chat ? <Navigate to="/chat" /> : <Navigate to="/start" />}
				/>
				<Route
					path="/start"
					element={chat ? <Navigate to="/chat" /> : <StartChatPage />}
				/>
				<Route
					path="/chat"
					element={chat ? <ChatPage /> : <Navigate to="/start" />}
				/>
			</Routes> */}
    </>
  );
}

export default App;
