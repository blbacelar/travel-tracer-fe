import React, { createContext, useContext, useState } from "react";

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
  deleteLocation: (locationId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const calculateTotalExpenses = (locations: TripLocation[]) => {
    console.log("Calculating expenses for locations:", locations);

    const total = locations.reduce((total, location) => {
      console.log("Processing location:", location);

      if (location.cost) {
        if (location.startDate !== location.endDate) {
          const days = Math.ceil(
            (new Date(location.endDate).getTime() -
              new Date(location.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          console.log(
            "Multi-day stay:",
            days,
            "days at",
            location.cost,
            "per day"
          );
          return total + location.cost * days;
        }
        console.log("Single day cost:", location.cost);
        return total + location.cost;
      }
      return total;
    }, 0);

    console.log("Total expenses calculated:", total);
    return total;
  };

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

    console.log("Adding location with cost:", location.cost);

    const updatedLocations = [...currentTrip.locations, location];
    const totalExpenses = calculateTotalExpenses(updatedLocations);

    console.log("Setting new trip state with expenses:", totalExpenses);

    setCurrentTrip({
      ...currentTrip,
      locations: updatedLocations,
      expenses: totalExpenses,
    });
  };

  const updateExpenses = (locationId: string, cost: number) => {
    if (!currentTrip) return;

    const updatedLocations = currentTrip.locations.map((loc) =>
      loc.id === locationId ? { ...loc, cost } : loc
    );

    const totalExpenses = calculateTotalExpenses(updatedLocations);

    setCurrentTrip({
      ...currentTrip,
      locations: updatedLocations,
      expenses: totalExpenses,
    });
  };

  const hasActiveTrip = () => currentTrip !== null;

  const deleteLocation = (locationId: string) => {
    if (!currentTrip) return;

    const updatedLocations = currentTrip.locations.filter(
      location => location.id !== locationId
    );
    
    const totalExpenses = calculateTotalExpenses(updatedLocations);

    setCurrentTrip({
      ...currentTrip,
      locations: updatedLocations,
      expenses: totalExpenses,
    });
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        createTrip,
        addLocation,
        updateExpenses,
        hasActiveTrip,
        deleteLocation,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
