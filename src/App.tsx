import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import EntryView from './components/EntryView';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import ReportsView from './components/ReportsView';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<EntryView />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/inventory" element={<InventoryView />} />
          <Route path="/sales" element={<SalesView />} />
          <Route path="/reports" element={<ReportsView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
