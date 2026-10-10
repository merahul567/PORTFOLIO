package in.kumarrahul.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.kumarrahul.portfolio.client.RapidApiClient;
import in.kumarrahul.portfolio.dto.EtfPremiumDTO;
import in.kumarrahul.portfolio.dto.MarketQuoteDTO;
import in.kumarrahul.portfolio.dto.MarketSnapshotDTO;
import in.kumarrahul.portfolio.entity.MarketData;
import in.kumarrahul.portfolio.repository.MarketDataRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {

    private static final List<EtfMonitorConfig> ETF_MONITORS = List.of(
            new EtfMonitorConfig("QQQ", "Invesco NASDAQ 100 ETF", "QQQ", 693.0, null),
            new EtfMonitorConfig("SPY", "SPDR S&P 500 ETF Trust", "SPY", 572.0, null),
            new EtfMonitorConfig("VTI", "Vanguard Total Stock Market ETF", "VTI", 260.0, null),
            new EtfMonitorConfig("MN100.NS", "Motilal Oswal NASDAQ 100 ETF", "MN100.NS", 27.0, null)
    );

    private static final Pattern NAV_PATTERN = Pattern.compile("(?i)(?:nav|net asset value|net asset price|price per unit)[^\\d]{0,25}(\\d+(?:\\.\\d+)?)");

    private final RapidApiClient rapidApiClient;
    private final MarketDataRepository marketDataRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void initializeMarketData() {
        log.info("Initializing ExchangeRate-API market data on startup");
        refreshMarketData();
    }

    public MarketSnapshotDTO getMarketSnapshot() {
        log.info("Fetching ExchangeRate-API market snapshot");
        MarketSnapshotDTO snapshot = new MarketSnapshotDTO();

        snapshot.setUsdInr(getCurrencyQuoteFromDB("USD/INR", "USD / INR"));
        snapshot.setEurInr(getCurrencyQuoteFromDB("EUR/INR", "EUR / INR"));
        snapshot.setGbpInr(getCurrencyQuoteFromDB("GBP/INR", "GBP / INR"));

        snapshot.setNifty50(unavailableQuote("NIFTY 50", "NSE:NIFTY", "INDIA"));
        snapshot.setBankNifty(unavailableQuote("Bank Nifty", "NSE:BANKNIFTY", "INDIA"));
        snapshot.setSensex(unavailableQuote("Sensex", "INDEXBOM:SENSEX", "INDIA"));
        snapshot.setGold(unavailableQuote("Gold", "MCX:GOLD1!", "COMMODITY"));
        return snapshot;
    }

    public List<EtfPremiumDTO> getEtfPremiumScan() {
        List<EtfPremiumDTO> rows = new ArrayList<>();
        String updatedAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        for (EtfMonitorConfig config : ETF_MONITORS) {
            double marketPrice = fetchYahooMarketPrice(config.ticker());
            Double navPrice = config.referenceNav() != null ? config.referenceNav() : fetchPublicNavPrice(config.ticker());

            EtfPremiumDTO dto = new EtfPremiumDTO();
            dto.setTicker(config.ticker());
            dto.setName(config.name());
            dto.setMarketPrice(marketPrice > 0 ? marketPrice : null);
            dto.setNavPrice(navPrice != null && navPrice > 0 ? navPrice : null);
            dto.setSource("Yahoo Finance + public NAV fallback");
            dto.setLastUpdated(updatedAt);

            if (marketPrice <= 0) {
                dto.setStatus("Unavailable");
                dto.setMessage("Could not load market price from Yahoo Finance.");
                rows.add(dto);
                continue;
            }

            if (navPrice == null || navPrice <= 0) {
                dto.setStatus("Unavailable");
                dto.setMessage("No public NAV reference available for this ETF right now.");
                rows.add(dto);
                continue;
            }

            double premiumPercent = ((marketPrice - navPrice) / navPrice) * 100.0;
            dto.setPremiumPercent(premiumPercent);
            dto.setStatus("Available");
            dto.setMessage(premiumPercent >= 0 ? "Premium" : "Discount");
            rows.add(dto);
        }
        return rows;
    }

    private Double fetchPublicNavPrice(String ticker) {
        try {
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + ticker + "?range=1d&interval=1d";
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isBlank()) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response);
            JsonNode navNode = root.at("/chart/result/0/meta/regularMarketPrice");
            if (!navNode.isMissingNode() && navNode.isNumber()) {
                return navNode.asDouble();
            }
        } catch (Exception e) {
            log.warn("No public NAV feed available for {}: {}", ticker, e.getMessage());
        }
        return null;
    }

    private double fetchYahooMarketPrice(String ticker) {
        try {
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + ticker + "?range=1d&interval=1d";
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isBlank()) {
                return 0d;
            }

            JsonNode root = objectMapper.readTree(response);
            JsonNode priceNode = root.at("/chart/result/0/meta/regularMarketPrice");
            if (!priceNode.isMissingNode() && priceNode.isNumber()) {
                return priceNode.asDouble();
            }
        } catch (Exception e) {
            log.warn("Unable to fetch market price for {}: {}", ticker, e.getMessage());
        }
        return 0d;
    }

    private void fetchAndSyncAllForexRates() {
        try {
            log.info("Attempting to fetch base currencies from ExchangeRate-API...");
            JsonNode data = rapidApiClient.getForexData("USD", "INR");

            if (data != null && data.has("conversion_rates")) {
                JsonNode rates = data.get("conversion_rates");

                if (rates.has("INR")) {
                    double usdInr = rates.get("INR").asDouble();
                    saveMarketData("USD/INR", "CURRENCY", "USD / INR", usdInr, "ExchangeRate-API");
                    log.info("✅ USD/INR updated: {}", usdInr);

                    if (rates.has("EUR")) {
                        double eurInr = usdInr / rates.get("EUR").asDouble();
                        saveMarketData("EUR/INR", "CURRENCY", "EUR / INR", eurInr, "ExchangeRate-API");
                    }

                    if (rates.has("GBP")) {
                        double gbpInr = usdInr / rates.get("GBP").asDouble();
                        saveMarketData("GBP/INR", "CURRENCY", "GBP / INR", gbpInr, "ExchangeRate-API");
                    }
                }
            } else {
                log.warn("⚠️ ExchangeRate-API returned null or unexpected data payload structures.");
            }
        } catch (Exception e) {
            log.error("❌ Exception occurred during Forex batch compute loops: {}", e.getMessage());
        }
    }

    private MarketQuoteDTO getCurrencyQuoteFromDB(String symbol, String displayName) {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol(symbol);
        quote.setName(displayName);
        quote.setCategory("CURRENCY");
        quote.setTimestamp(LocalDateTime.now().toString());

        marketDataRepository.findBySymbol(symbol).ifPresentOrElse(
                dbData -> {
                    quote.setCurrentPrice(dbData.getCurrentPrice());
                    quote.setStatus("Available");
                    quote.setSource(dbData.getSource());
                    quote.setChange(0.0);
                    quote.setChangePercent(0.0);
                },
                () -> {
                    quote.setStatus("Unavailable");
                    quote.setMessage("No historical cache present in system database.");
                }
        );
        return quote;
    }

    private MarketQuoteDTO unavailableQuote(String name, String symbol, String category) {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setName(name);
        quote.setSymbol(symbol);
        quote.setCategory(category);
        quote.setStatus("Unavailable");
        quote.setMessage("No live feed configured");
        quote.setTimestamp(LocalDateTime.now().toString());
        return quote;
    }

    private void saveMarketData(String symbol, String category, String name, Double price, String source) {
        try {
            MarketData marketData = marketDataRepository.findBySymbol(symbol).orElse(new MarketData());
            marketData.setSymbol(symbol);
            marketData.setCategory(category);
            marketData.setName(name);
            marketData.setCurrentPrice(price);
            marketData.setChange(0.0);
            marketData.setChangePercent(0.0);
            marketData.setTimestamp(LocalDateTime.now());
            marketData.setSource(source);
            marketDataRepository.save(marketData);
        } catch (Exception e) {
            log.error("❌ Failed to save tracking entity symbol {}: {}", symbol, e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 10000000)
    public void refreshMarketData() {
        log.info("⏰ SCHEDULED REFRESH: Syncing exchange rate cache sets...");
        fetchAndSyncAllForexRates();
    }

    private record EtfMonitorConfig(String ticker, String name, String nameKey, Double referenceNav, String navUrl) {
    }
}