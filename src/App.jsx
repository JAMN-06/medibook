import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DoctorsListPage from "./pages/DoctorsListPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
    return (
        <ThemeProvider>
            <AppointmentsProvider>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<DoctorsListPage />} />
                        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
                        <Route path="/doctors/:doctorId/book" element={<BookAppointmentPage />} />
                        <Route path="/appointments" element={<MyAppointmentsPage />} />
                    </Routes>
                </main>
            </AppointmentsProvider>
        </ThemeProvider>
    );
}

export default App;