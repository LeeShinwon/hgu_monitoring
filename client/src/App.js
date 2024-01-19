import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { tableData } from "../src/pages/RealTimeView/RTTable/tableData";
import './App.css';

import NavigationBar from './components/NavigationBar/NavigationBar';
import MapView from './pages/MapView/MapView';
import RealTimeView from './pages/RealTimeView/RealTimeView';
import StatisticsDayView from './pages/StatisticsView/Day/StatisticsDayView';
import StatisticsMonthView from './pages/StatisticsView/Month/StatisticsMonthView';
import Footer from './components/Footer/Footer'

function App() {
  return (
    <Router>
      <NavigationBar/>
      <hr className='nav-hr'></hr>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/realTime" element={<RealTimeView />} />
          <Route path="/statisticsDay" element={<StatisticsDayView />} />
          <Route path="/statisticsMonth" element={<StatisticsMonthView />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
