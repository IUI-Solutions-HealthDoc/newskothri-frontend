import { NSE_TOP_STOCKS, TOP_MOVERS_COUNT, type NseStockConfig } from "../../data/nseTopStocks";
import { fetchYahooChartQuote } from "./yahooChartQuote";

export type StockMover = {
  id: string;
  symbol: string;
  labelEn: string;
  labelHi: string;
  price: number;
  change: number;
  changePct: number;
};

async function fetchStockMover(
  config: NseStockConfig,
  revalidateSec: number
): Promise<StockMover | null> {
  const q = await fetchYahooChartQuote(config.yahooSymbol, revalidateSec);
  if (!q) return null;
  return {
    id: config.yahooSymbol.replace(/\.NS$/i, "").toLowerCase(),
    symbol: config.yahooSymbol,
    labelEn: config.labelEn,
    labelHi: config.labelHi,
    price: q.price,
    change: q.change,
    changePct: q.changePct,
  };
}

export type TopMoversSnapshot = {
  gainers: StockMover[];
  losers: StockMover[];
};

/** Top N gainers/losers from a curated NSE large-cap watchlist. */
export async function fetchTopMovers(revalidateSec = 120): Promise<TopMoversSnapshot> {
  const results = await Promise.all(
    NSE_TOP_STOCKS.map((cfg) => fetchStockMover(cfg, revalidateSec))
  );
  const movers = results.filter((m): m is StockMover => m != null);

  const gainers = [...movers]
    .filter((m) => m.changePct > 0)
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, TOP_MOVERS_COUNT);

  const losers = [...movers]
    .filter((m) => m.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, TOP_MOVERS_COUNT);

  return { gainers, losers };
}
