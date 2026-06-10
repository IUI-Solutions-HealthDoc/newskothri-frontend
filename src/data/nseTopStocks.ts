/** Liquid NSE large caps (Yahoo: `SYMBOL.NS`) — used to compute daily top movers. */
export type NseStockConfig = {
  yahooSymbol: string;
  labelEn: string;
  labelHi: string;
};

export const NSE_TOP_STOCKS: NseStockConfig[] = [
  { yahooSymbol: "RELIANCE.NS", labelEn: "Reliance", labelHi: "रिलायंस" },
  { yahooSymbol: "TCS.NS", labelEn: "TCS", labelHi: "टीसीएस" },
  { yahooSymbol: "HDFCBANK.NS", labelEn: "HDFC Bank", labelHi: "एचडीएफसी बैंक" },
  { yahooSymbol: "INFY.NS", labelEn: "Infosys", labelHi: "इंफोसिस" },
  { yahooSymbol: "ICICIBANK.NS", labelEn: "ICICI Bank", labelHi: "आईसीआईसीआई बैंक" },
  { yahooSymbol: "SBIN.NS", labelEn: "SBI", labelHi: "एसबीआई" },
  { yahooSymbol: "BHARTIARTL.NS", labelEn: "Bharti Airtel", labelHi: "भारती एयरटेल" },
  { yahooSymbol: "ITC.NS", labelEn: "ITC", labelHi: "आईटीसी" },
  { yahooSymbol: "LT.NS", labelEn: "L&T", labelHi: "एल एंड टी" },
  { yahooSymbol: "KOTAKBANK.NS", labelEn: "Kotak Bank", labelHi: "कोटक बैंक" },
  { yahooSymbol: "HINDUNILVR.NS", labelEn: "Hindustan Unilever", labelHi: "हिंदुस्तान यूनिलीवर" },
  { yahooSymbol: "AXISBANK.NS", labelEn: "Axis Bank", labelHi: "ऐक्सिस बैंक" },
  { yahooSymbol: "BAJFINANCE.NS", labelEn: "Bajaj Finance", labelHi: "बजाज फाइनांस" },
  { yahooSymbol: "MARUTI.NS", labelEn: "Maruti", labelHi: "मारुति" },
  { yahooSymbol: "SUNPHARMA.NS", labelEn: "Sun Pharma", labelHi: "सन फार्मा" },
  { yahooSymbol: "TITAN.NS", labelEn: "Titan", labelHi: "टाइटन" },
  { yahooSymbol: "WIPRO.NS", labelEn: "Wipro", labelHi: "विप्रो" },
  { yahooSymbol: "HCLTECH.NS", labelEn: "HCL Tech", labelHi: "एचसीएल टेक" },
  { yahooSymbol: "TATASTEEL.NS", labelEn: "Tata Steel", labelHi: "टाटा स्टील" },
  { yahooSymbol: "ADANIENT.NS", labelEn: "Adani Ent.", labelHi: "अदानी एंट." },
  { yahooSymbol: "NTPC.NS", labelEn: "NTPC", labelHi: "एनटीपीसी" },
  { yahooSymbol: "M&M.NS", labelEn: "M&M", labelHi: "एम एंड एम" },
  { yahooSymbol: "ULTRACEMCO.NS", labelEn: "UltraTech", labelHi: "अल्ट्राटेक" },
  { yahooSymbol: "BAJAJFINSV.NS", labelEn: "Bajaj Finserv", labelHi: "बजाज फिनसर्व" },
];

export const TOP_MOVERS_COUNT = 5;
