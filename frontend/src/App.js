import './App.css';
import MainPage from './pages/MainPage';
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
  } from "react-router-dom";

export default function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<MainPage />}>
                <Route path="ceva" element={<MainPage />} />
                </Route>
            </Routes>
        </div>
    );
}
