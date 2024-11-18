import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import UitgavenLijst from './components/UitgavenLijst';
import Statistieken from './components/Statistieken';
import Instellingen from './components/Instellingen';
import UitgavenFilter from './components/UitgavenFilter';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/uitgaven" element={
              <PrivateRoute>
                <UitgavenLijst />
              </PrivateRoute>
            } />
            <Route path="/statistieken" element={
              <PrivateRoute>
                <Statistieken />
              </PrivateRoute>
            } />
            <Route path="/instellingen" element={
              <PrivateRoute>
                <Instellingen />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </AuthProvider>
    </div>
  );
}

export default App;