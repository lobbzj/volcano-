import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './components/Nav';
import { AuthProvider } from './functions/AuthContext';  

// pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VolcanoList from "./pages/VolcanoList";
import VolcanoDetails from './pages/VolcanoDetails';

function App() {
    return (
        <AuthProvider> 
    <div className="container mt-3">
        <BrowserRouter>
            <div >
                {/* the content */}
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/volcanolist" element={<VolcanoList />} />
                    <Route path="/volcano/:id" element={<VolcanoDetails />} />
                    <Route path="/login" element={<Auth isRegistering={false} />} />
                    <Route path="/register" element={<Auth isRegistering={true} />} />
                </Routes>
            </div>
        </BrowserRouter>
    </div>
    </AuthProvider>);
}

export default App;