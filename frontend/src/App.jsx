import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Header/>
        <Routes>
          <Route path="/" element={ <PrivateRoute element={<HomePage/>}/>}/>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter> 
  );
}

export default App;
