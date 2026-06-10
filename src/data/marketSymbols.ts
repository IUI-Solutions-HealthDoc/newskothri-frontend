/** Indian market indices for the business-article widget (Yahoo Finance chart symbols). */
export type MarketSymbolConfig = {
  id: string;
  yahooSymbol: string;
  labelEn: string;
  labelHi: string;
};

export const MARKET_SYMBOLS: MarketSymbolConfig[] = [
  {
    id: "nifty50",
    yahooSymbol: "^NSEI",
    labelEn: "NIFTY 50",
    labelHi: "निफ्टी 50",
  },
  {
    id: "sensex",
    yahooSymbol: "^BSESN",
    labelEn: "SENSEX",
    labelHi: "सेंसेक्स",
  },
  {
    id: "banknifty",
    yahooSymbol: "^NSEBANK",
    labelEn: "BANK NIFTY",
    labelHi: "बैंक निफ्टी",
  },
];
