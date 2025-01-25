import React, { createContext, useState, useContext } from 'react';
import EventsPage from "./components/EventsPage";
import CreateEventPage from './components/CreateEventPage';
import PartnersPage from './components/PartnersPage';
import ReportsPage from './components/Reports/ReportsPage';
import HomePage from './components/HomePage';
import EditEventPage from './components/EditEventPage';
import ViewReport from './components/Reports/ViewReport';
import CreateReport from './components/Reports/CreateReport';
import EditReport from './components/Reports/EditReport';
import  AddPartner from './components/AddPartnersPage'; 
import  ViewPartner from './components/ViewPartnersPage'; 
import  EditPartner from './components/EditPartnerPage'; 


const Routes = createContext();

export const RoutesProvider = ({ children }) => {
  const pages = {
    Home: { component: HomePage, options: { headerShown: false } },
    Events: { component: EventsPage, options: { headerShown: false } },
    createEvent: { component: CreateEventPage, options: { headerShown: false } },
    Partners: { component: PartnersPage, options: { headerShown: false } },
    Reports: { component: ReportsPage, options: { headerShown: false } },
    EditEventPage: { component: EditEventPage, options: { headerShown: false } },
    ViewReport: { component: ViewReport, options: { headerShown: false } },
    CreateReport: { component: CreateReport, options: { headerShown: false } },
    EditReport: { component: EditReport, options: { headerShown: false } },
    AddPartner: { component: AddPartner, options: { headerShown: false } }, 
    EditPartner: { component: EditPartner, options: { headerShown: false } }, 
    ViewPartner: { component: ViewPartner, options: { headerShown: false } },
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
