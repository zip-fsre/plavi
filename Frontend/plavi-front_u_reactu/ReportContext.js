import React, { createContext, useState, useContext } from 'react';

// Kreiranje ReportContext
const ReportContext = createContext();

export const useReportContext = () => useContext(ReportContext); // Hook za dohvat podataka iz konteksta

export const ReportProvider = ({ children }) => {
  const [reportData, setReportData] = useState([]);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportTitle, setReportTitle] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');

  return (
    <ReportContext.Provider value={{
      reportData, setReportData,
      description, setDescription,
      startDate, setStartDate,
      endDate, setEndDate,
      reportTitle, setReportTitle,
      selectedPartner, setSelectedPartner
    }}>
      {children}
    </ReportContext.Provider>
  );
};