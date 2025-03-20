import React, { createContext, useState, useContext, useEffect } from 'react';

// Available currencies with their symbols and conversion rates (relative to USD)
export const CURRENCIES = {
  USD: { symbol: '$', name: 'USD', rate: 1 },
  EUR: { symbol: '€', name: 'EUR', rate: 0.92 },
  GBP: { symbol: '£', name: 'GBP', rate: 0.79 },
  JPY: { symbol: '¥', name: 'JPY', rate: 151.12 },
  AUD: { symbol: 'A$', name: 'AUD', rate: 1.52 },
  CAD: { symbol: 'C$', name: 'CAD', rate: 1.37 },
  ZAR: { symbol: 'R', name: 'ZAR', rate: 18.45 }
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Get saved currency from localStorage or default to USD
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency && CURRENCIES[savedCurrency] 
      ? savedCurrency 
      : 'USD';
  });

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Format price based on current currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    
    const currencyData = CURRENCIES[currency];
    const convertedPrice = price * currencyData.rate;
    
    // Format based on currency conventions
    return `${currencyData.symbol}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice,
      currencies: CURRENCIES 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook for using the currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
