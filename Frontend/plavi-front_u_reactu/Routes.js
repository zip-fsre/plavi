import React, { createContext, useState, useContext } from 'react';
import EventsPage from "./components/EventsPage";
import CreateEventPage from './components/CreateEventPage';
import PartnersPage from './components/PartnersPage';
import ReportsPage from './components/ReportsPage';
import HomePage from './components/HomePage';
import EditEventPage from './components/EditEventPage';

const Routes = createContext();

export const RoutesProvider = ({ children }) => {
  const pages = {
    Home: { component: HomePage, options: { headerShown: false } },
    Events: { component: EventsPage, options: { headerShown: false } },
    createEvent: { component: CreateEventPage, options: { headerShown: false } },
    Partners: { component: PartnersPage, options: { headerShown: false } },
    Reports: { component: ReportsPage, options: { headerShown: false } },
    EditEventPage: { component: EditEventPage, options: { headerShown: false } },
  };

  const [currentPage, setCurrentPage] = useState(pages['Home']);
  

  return (
    <Routes.Provider value={{ currentPage, setCurrentPage, pages }}>
      {children}
    </Routes.Provider>
  );
};

export const usePage = () => {
  const context = useContext(Routes);
  return context;
};