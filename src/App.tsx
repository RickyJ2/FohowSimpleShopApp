import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import EntryView from './components/EntryView';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
// import SalesView from './components/SalesView';
// import ReportsView from './components/ReportsView';
import Header from './components/Header';
import './App.css';

/**
 * App.tsx - Router Configuration
 * Main entry point for the application.
 * Features:
 * - Device ID locking via EntryView
 * - Grouped Inventory Management
 * - 2-Step Batch Selection Sales
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          {/* Main Entry & Auth */}
          <Route path="/" element={<EntryView />} />
          
          {/* Navigation Hub */}
          <Route path="/dashboard" element={<DashboardView />} />
          
          {/* Core Modules */}
          <Route path="/inventory" element={<InventoryView />} />
          {/* <Route path="/sales" element={<SalesView />} /> */}
          
          {/* Placeholders / Coming Soon */}
          {/* <Route path="/reports" element={<ReportsView />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
