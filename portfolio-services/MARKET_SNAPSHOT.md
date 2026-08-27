# Market Snapshot Backend API

A free, public API-based backend service that provides real-time market data for commodities, indices, and forex rates.

## Features

- **Zero Cost**: Uses only free public APIs (no paid subscriptions)
- **Real-time Data**: Fetches live market quotes
- **Multiple Data Sources**: 
  - Yahoo Finance (Stocks & Indices)
  - ExchangeRate API (Forex)
  - Metals API (Commodities)
  - AlphaVantage (Stocks & Forex backup)

## Supported Instruments

### Commodities
- **Gold** - via Metals API

### India Indices  
- **Nifty 50** (Symbol: ^NSEI) - via Yahoo Finance
- **Sensex** (Symbol: ^BSESN) - via Yahoo Finance

### Global Indices
- **NASDAQ** (Symbol: ^IXIC) - via Yahoo Finance

### Currency
- **USD/INR** - via ExchangeRate API

## API Endpoints

### Get Market Snapshot
```
GET /api/market/snapshot
```

**Response:**
```json
{
  "gold": {
    "symbol": "GOLD",
    "category": "COMMODITY",
    "name": "Gold",
    "currentPrice": 1234.50,
    "change": 12.34,
    "changePercent": 1.01,
    "timestamp": "2026-08-27T15:03:27",
    "source": "Metals API",
    "status": "Available",
    "message": null
  },
  "nifty50": {
    "symbol": "^NSEI",
    "category": "INDIA",
    "name": "Nifty 50",
    "currentPrice": 23145.60,
    "change": 45.30,
    "changePercent": 0.20,
    "timestamp": "2026-08-27T15:03:27",
    "source": "Yahoo Finance",
    "status": "Available",
    "message": null
  },
  "sensex": {
    "symbol": "^BSESN",
    "category": "INDIA",
    "name": "Sensex",
    "currentPrice": 76234.80,
    "change": 120.50,
    "changePercent": 0.16,
    "timestamp": "2026-08-27T15:03:27",
    "source": "Yahoo Finance",
    "status": "Available",
    "message": null
  },
  "nasdaq": {
    "symbol": "^IXIC",
    "category": "GLOBAL",
    "name": "NASDAQ",
    "currentPrice": 18456.30,
    "change": 89.20,
    "changePercent": 0.49,
    "timestamp": "2026-08-27T15:03:27",
    "source": "Yahoo Finance",
    "status": "Available",
    "message": null
  },
  "usdInr": {
    "symbol": "USD/INR",
    "category": "CURRENCY",
    "name": "USD / INR",
    "currentPrice": 82.45,
    "change": 0.15,
    "changePercent": 0.18,
    "timestamp": "2026-08-27T15:03:27",
    "source": "ExchangeRate API",
    "status": "Available",
    "message": null
  }
}
```

## Architecture

```
MarketController
    ↓
MarketDataService
    ├→ YahooFinanceClient (Indian & Global Indices)
    ├→ RapidApiClient (Forex via ExchangeRate API)
    ├→ AlphaVantageClient (Backup sources)
    └→ MarketDataRepository (H2 Database caching)
```

### Components

1. **MarketController** - REST endpoint handling CORS-enabled requests
2. **MarketDataService** - Business logic for fetching and caching market data
3. **Client Services** - Integrations with external APIs:
   - YahooFinanceClient
   - RapidApiClient  
   - AlphaVantageClient
4. **MarketDataRepository** - Persists market data in H2 database
5. **Scheduled Refresh** - Automatically updates data every 5 minutes

## API Rate Limits

- **Yahoo Finance**: No official limit (reasonable usage)
- **ExchangeRate API**: 1,500 requests/month (free tier)
- **Metals API**: 500 requests/month (free tier)
- **AlphaVantage**: 5 API calls/minute (free tier with demo key)

## CORS Configuration

Allowed origins (configured in `application.properties`):
- `http://localhost:3000` (development)
- `https://www.kumarrahul.in` (production)
- `https://kumarrahul.in` (production)

## Database

Uses in-memory H2 database for caching market data.

**Schema:**
```sql
CREATE TABLE market_data (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  current_price DOUBLE,
  change DOUBLE,
  change_percent DOUBLE,
  timestamp TIMESTAMP,
  source VARCHAR(100)
);
```

## Error Handling

When an API is unavailable:
- Status: `"Unavailable"`
- Message: `"No live feed configured"` or `"Error fetching data"`
- Cached data is returned if available
- Graceful fallbacks to alternative data sources

## Future Enhancements

- Add more indices (S&P 500, DAX, Nikkei)
- Implement Redis caching for better performance
- Add historical data tracking
- Real-time WebSocket updates
- Multiple currency pairs support
- Crypto data integration

## Testing

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Access API
curl http://localhost:8080/api/market/snapshot
```

## Notes

- All APIs are free public services with no authentication required
- Data freshness depends on API update frequency (typically 15-20 minute delay for stocks)
- During market holidays, indices may show stale data
- If multiple APIs fail, all instruments will show "Unavailable"

---

Created with ❤️ for real-time market data without costs!
