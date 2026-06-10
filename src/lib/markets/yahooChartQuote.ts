const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
const USER_AGENT = "NewsKothari/1.0 (market-widget; +https://www.newskothri.com)";

export type YahooChartQuote = {
  symbol: string;
  shortName?: string;
  price: number;
  change: number;
  changePct: number;
  dayHigh?: number;
  dayLow?: number;
  updatedAt: string;
};

type YahooChartMeta = {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  regularMarketTime?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
};

type YahooChartResponse = {
  chart?: {
    result?: { meta?: YahooChartMeta }[];
  };
};

export async function fetchYahooChartQuote(
  yahooSymbol: string,
  revalidateSec = 120
): Promise<YahooChartQuote | null> {
  const url = new URL(`${YAHOO_CHART}/${encodeURIComponent(yahooSymbol)}`);
  url.searchParams.set("interval", "1d");
  url.searchParams.set("range", "1d");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: revalidateSec },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as YahooChartResponse;
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = Number(meta.regularMarketPrice);
    const prevClose = Number(meta.chartPreviousClose);
    if (!Number.isFinite(price) || price <= 0) return null;

    const change = Number.isFinite(prevClose) && prevClose > 0 ? price - prevClose : 0;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

    const ts = Number(meta.regularMarketTime);
    const updatedAt =
      Number.isFinite(ts) && ts > 0 ? new Date(ts * 1000).toISOString() : new Date().toISOString();

    const dayHigh = Number(meta.regularMarketDayHigh);
    const dayLow = Number(meta.regularMarketDayLow);

    return {
      symbol: yahooSymbol,
      shortName: meta.shortName || meta.longName,
      price,
      change,
      changePct,
      dayHigh: Number.isFinite(dayHigh) && dayHigh > 0 ? dayHigh : undefined,
      dayLow: Number.isFinite(dayLow) && dayLow > 0 ? dayLow : undefined,
      updatedAt,
    };
  } catch {
    return null;
  }
}
