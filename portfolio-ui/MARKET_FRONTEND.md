# Market Snapshot Frontend Implementation

Complete React frontend for real-time market data display with support for both homepage widget and full dashboard page.

## Components

### 1. **MarketSnapshot Component**
**Location:** `src/components/MarketSnapshot.js`

Reusable component for displaying a quick market overview in a grid layout.

**Features:**
- 5-column grid showing Gold, Nifty 50, Sensex, NASDAQ, USD/INR
- Auto-refreshes every 5 minutes
- Loading state with skeleton cards
- Error handling with fallback messaging
- Responsive layout adapts to mobile

**Usage:**
```jsx
import MarketSnapshot from '../components/MarketSnapshot';

<MarketSnapshot />
```

**Data Format:**
```javascript
{
  gold: {
    symbol: "GOLD",
    category: "COMMODITY",
    name: "Gold",
    currentPrice: 1234.50,
    change: 12.34,
    changePercent: 1.01,
    timestamp: "2026-08-27T15:03:27",
    source: "Metals API",
    status: "Available",
    message: null
  },
  // ... more instruments
}
```

### 2. **MarketDashboard Component**
**Location:** `src/components/MarketDashboard.js`

Full-featured dashboard for detailed market analysis with sections and cards.

**Features:**
- Organized sections: Indian Markets, Global Markets, Commodities & Currency
- Individual market cards with:
  - Current price with monospace font
  - Daily change and percentage
  - Data source attribution
  - Timestamp of last update
  - Unavailable states with reasons
- Dashboard header showing update status
- Data refresh timer (5 minutes)
- Mobile-responsive card grid
- Footer with disclaimers

**Usage:**
```jsx
import MarketDashboard from '../components/MarketDashboard';

<MarketDashboard />
```

## Pages Updated

### 1. **HomePage** (`src/pages/HomePage.js`)
- Replaced hardcoded snapshot with `<MarketSnapshot />` component
- Maintains existing layout and styling
- Auto-updates market data when component mounts

### 2. **MarketsPage** (`src/pages/MarketsPage.js`)
- Now displays full `<MarketDashboard />` component
- Updated page description to reflect live data capability
- Cleaner, more professional presentation

## Styling

### CSS Classes Added

**Market Dashboard:**
- `.market-dashboard` - Main container
- `.dashboard-header` - Status and timestamp header
- `.dashboard-status` - Live/updating status indicator
- `.dashboard-timestamp` - Last updated time
- `.market-section` - Individual data section
- `.section-header` - Section title and description
- `.market-cards-grid` - Responsive grid container
- `.market-card` - Individual market data card
- `.card-header` - Instrument name and symbol
- `.card-content` - Price and meta information
- `.card-unavailable` - Unavailable state styling
- `.price-section` - Price display area
- `.price` - Large price number
- `.change` - Daily change container
- `.change.positive` - Green color for gains
- `.change.negative` - Red color for losses
- `.card-meta` - Metadata (source, timestamp)
- `.meta-row` - Metadata row layout
- `.meta-label` - Label for metadata
- `.meta-value` - Metadata value
- `.dashboard-footer` - Footer section
- `.dashboard-footer .note` - Footer notes/disclaimers

**Responsive Classes:**
- Mobile: Single-column card grid
- Tablet: Auto-fit grid with 280px minimum width
- Desktop: Auto-fit grid with flexible columns

### Color Scheme

Uses existing CSS variables:
- `--ink` - Primary text color
- `--muted` - Secondary text color
- `--faint` - Tertiary/subtle text
- `--line` - Border color
- `--bg-elevated` - Card background
- `--accent` - Hover accent color
- `#10b981` - Green (positive change)
- `#ef4444` - Red (negative change)

## API Integration

### API Service
Uses existing `apiService.js` with axios:

```javascript
import { axiosGet } from '../apiService';

const data = await axiosGet('market/snapshot');
```

**Endpoint:** `/api/market/snapshot`

**Base URL:** Configured via `REACT_APP_API_BASE_URL` env variable
Default: `/api/` (proxied to `http://localhost:8080` via package.json)

### Data Flow

```
Component Mount
    ↓
axiosGet('market/snapshot')
    ↓
Backend API → /api/market/snapshot
    ↓
Parse & Set State
    ↓
Render Market Data
    ↓
Schedule Refresh (5 min)
```

## State Management

Each component manages its own state:

```javascript
const [marketData, setMarketData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [lastUpdated, setLastUpdated] = useState(null);
```

**State Transitions:**
1. Initial: `loading=true, marketData=null`
2. Success: `loading=false, marketData={...}`
3. Error: `loading=false, error="message", marketData=null`

## Formatting Functions

### Price Formatting
```javascript
formatPrice(1234.567) // "1,234.57"
```

### Change Formatting
```javascript
formatChange(12.34, 1.01) // "+12.34 (+1.01%)"
```

### Timestamp Formatting
```javascript
formatTimestamp("2026-08-27T15:03:27") 
// "Aug 27, 2026, 03:03:27 PM"
```

### Last Updated Display
```javascript
formatLastUpdated() // "5m ago"
```

## Error Handling

**Component-level:**
- Network errors → Graceful error message
- Missing data → "Unavailable" status
- Stale data → Cache shown until refresh
- API timeouts → Retry on next interval

**User-friendly messages:**
- "Loading..." - Initial fetch
- "Unavailable" - No data from API
- "No live feed configured" - API not returning data
- Custom error message for connection failures

## Responsive Design

### Breakpoints

**Mobile (< 640px)**
- Single column cards
- Full-width layout
- Adjusted spacing and padding

**Tablet (640px - 900px)**
- 2-column grid
- Flexible layout

**Desktop (> 900px)**
- Multi-column grid (auto-fit)
- Hover effects on cards
- Optimized spacing

## Performance Optimizations

1. **Memoization**: Components re-render only on prop/state changes
2. **Interval Cleanup**: useEffect cleanup prevents memory leaks
3. **Lazy Loading**: Components lazy-loaded in Routes
4. **Debouncing**: API calls cached with 5-minute refresh interval
5. **No Unnecessary Re-renders**: Shallow comparison of market data

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Manual Testing Checklist

- [ ] Homepage displays market snapshot
- [ ] Markets page shows full dashboard
- [ ] Auto-refresh updates data every 5 minutes
- [ ] Error message displays when API fails
- [ ] Loading state shows during fetch
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640px-900px)
- [ ] Desktop layout optimal (> 900px)
- [ ] Price formatting correct
- [ ] Change colors correct (green/red)
- [ ] Timestamps display properly
- [ ] No console errors

### API Testing
```bash
# Backend running on port 8080
curl http://localhost:8080/api/market/snapshot

# Or via React (with proxy)
curl http://localhost:3000/api/market/snapshot
```

## Development

### Start Development Server
```bash
npm start
```

Runs on `http://localhost:3000`
Proxies to `http://localhost:8080` for API calls

### Build for Production
```bash
npm run build
```

Optimized build ready for deployment

### Environment Variables

**`.env` file:**
```
REACT_APP_API_BASE_URL=/api/
```

## Troubleshooting

### "Unavailable" Status
- Check backend is running (`http://localhost:8080`)
- Check `/api/market/snapshot` endpoint
- Check browser console for CORS errors
- Check network tab for response

### Loading Never Completes
- API timeout (default 10 seconds)
- Backend service down
- Network connectivity issue
- Check `apiService.js` timeout setting

### Data Not Updating
- Check interval is running (5 minutes = 300,000ms)
- Check component not unmounted
- Check API returning new data
- Check browser DevTools Network tab

## Future Enhancements

1. **WebSocket Support**: Real-time updates instead of polling
2. **Historical Charts**: Display price history with Chart.js
3. **Watchlist**: Save favorite instruments
4. **Alerts**: Price threshold notifications
5. **Multiple Timeframes**: Intraday, weekly, monthly views
6. **Export Data**: CSV/JSON export functionality
7. **Comparison**: Side-by-side instrument comparison
8. **Dark Mode**: Theme-aware styling

---

**Last Updated:** 2026-08-27
**Status:** Production Ready
