import { BrowserRouter, Routes, Route }

from "react-router-dom";

import LandingPage
from "./pages/LandingPage";

import RegisterPage
from "./pages/RegisterPage";

import LoginPage
from "./pages/LoginPage";

import PatientDashboardPage
from "./pages/PatientDashboardPage";

import CategoriesPage
from "./pages/CategoriesPage";

import HomePage
from "./pages/HomePage";

import DoctorProfilePage
from "./pages/DoctorProfilePage";

import BookAppointmentPage
from "./pages/BookAppointmentPage";

import AdminDashboardPage
from "./pages/AdminDashboardPage";

import DoctorRequestPage
from "./pages/DoctorRequestPage";

import DoctorDashboardPage
from "./pages/DoctorDashboardPage";

import ProtectedRoute
from "./components/ProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                 <Route

                     path="/register/:role"
                     element={<RegisterPage />}
                 />

                <Route

                    path="/login/:role"
                    element={<LoginPage />}
                />

                <Route
                    path="/doctor-request"
                    element={<DoctorRequestPage />}
                />


                <Route

                    path="/admin-dashboard"

                    element={

                        <ProtectedRoute
                            allowedRole="ADMIN"
                        >

                            <AdminDashboardPage />

                        </ProtectedRoute>
                    }
                />


                <Route

                    path="/dashboard"

                    element={

                        <ProtectedRoute
                            allowedRole="PATIENT"
                        >

                            <PatientDashboardPage />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={<CategoriesPage />}
                />

                <Route
                    path="/home"
                    element={<HomePage />}
                />

                <Route
                    path="/doctor/:doctorId"
                    element={<DoctorProfilePage />}
                />

                <Route
                    path="/book/:doctorId"
                    element={<BookAppointmentPage />}
                />


                <Route

                    path="/doctor-dashboard"

                    element={

                        <ProtectedRoute
                            allowedRole="DOCTOR"
                        >

                            <DoctorDashboardPage />

                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>
    );
}

export default App;