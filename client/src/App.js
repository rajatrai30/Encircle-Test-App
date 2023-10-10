import { useStore } from "./zustand/store";
import { Navigate, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { StartChatPage } from "./pages/StartChatPage";
import { Navbar } from "./components/Navbar";
import './App.css'

function App() {
	const chat = useStore((state) => state.chat);

	return (
		<>
			<Navbar />
			<Routes>
				<Route
					path="/"
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
