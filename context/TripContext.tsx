import React, { createContext, useContext, useState } from 'react';

interface TripPeriod {
  startDate: Date;
  endDate: Date;
}

interface TripLocation {
  id: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  cost?: number;
  notes?: string;
}

interface Trip {
  id: string;
  name: string;
  period: TripPeriod;
  locations: TripLocation[];
  budget: number;
  expenses: number;
}

interface TripContextType {
  currentTrip: Trip | null;
  createTrip: (name: string, period: TripPeriod, budget: number) => void;
  addLocation: (location: TripLocation) => void;
  updateExpenses: (locationId: string, cost: number) => void;
  hasActiveTrip: () => boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const createTrip = (name: string, period: TripPeriod, budget: number) => {
    setCurrentTrip({
      id: Date.now().toString(),
      name,
      period,
      locations: [],
      budget,
      expenses: 0,
    });
  };

  const addLocation = (location: TripLocation) => {
    if (!currentTrip) return;
    setCurrentTrip({
      ...currentTrip,
      locations: [...currentTrip.locations, location],
    });
  };

  const updateExpenses = (locationId: string, cost: number) => {
    if (!currentTrip) return;
    const updatedLocations = currentTrip.locations.map(loc => 
      loc.id === locationId ? { ...loc, cost } : loc
    );
    setCurrentTrip({
      ...currentTrip,
      locations: updatedLocations,
      expenses: updatedLocations.reduce((total, loc) => total + (loc.cost || 0), 0),
    });
  };

  const hasActiveTrip = () => currentTrip !== null;

  return (
    <TripContext.Provider value={{
      currentTrip,
      createTrip,
      addLocation,
      updateExpenses,
      hasActiveTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}; 