import { MARKET_SYMBOLS, type MarketSymbolConfig } from "../../data/marketSymbols";
import { fetchTopMovers, type StockMover, type TopMoversSnapshot } from "./fetchTopMovers";
import { fetchYahooChartQuote } from "./yahooChartQuote";

export type { StockMover, TopMoversSnapshot };

export type MarketQuote = {
  id: string;
  symbol: string;
  labelEn: string;
  labelHi: string;
  price: number;
  change: number;
  changePct: number;
  dayHigh?: number;
  dayLow?: number;
  updatedAt: string;
};

export type MarketSnapshot = {
  quotes: MarketQuote[];
  topGainers: StockMover[];
  topLosers: StockMover[];
  fetchedAt: string;
  provider: "yahoo";
};

const REVALIDATE_SEC = 120;

async function fetchIndexQuote(config: MarketSymbolConfig): Promise<MarketQuote | null> {
  const q = await fetchYahooChartQuote(config.yahooSymbol, REVALIDATE_SEC);
  if (!q) return null;

  return {
    id: config.id,
    symbol: config.yahooSymbol,
    labelEn: config.labelEn,
    labelHi: config.labelHi,
    price: q.price,
    change: q.change,
    changePct: q.changePct,
    dayHigh: q.dayHigh,
    dayLow: q.dayLow,
    updatedAt: q.updatedAt,
  };
}

/** Cached indices + top NSE movers via Yahoo Finance (no API key). */
export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  const fetchedAt = new Date().toISOString();

  const [indexResults, movers] = await Promise.all([
    Promise.all(MARKET_SYMBOLS.map((cfg) => fetchIndexQuote(cfg))),
    fetchTopMovers(REVALIDATE_SEC),
  ]);

  const quotes = indexResults.filter((q): q is MarketQuote => q != null);

  return {
    quotes,
    topGainers: movers.gainers,
    topLosers: movers.losers,
    fetchedAt,
    provider: "yahoo",
  };
}
