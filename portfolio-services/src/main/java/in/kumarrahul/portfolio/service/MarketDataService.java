package in.kumarrahul.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import in.kumarrahul.portfolio.client.RapidApiClient;
import in.kumarrahul.portfolio.dto.MarketQuoteDTO;
import in.kumarrahul.portfolio.dto.MarketSnapshotDTO;
import in.kumarrahul.portfolio.entity.MarketData;
import in.kumarrahul.portfolio.repository.MarketDataRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {

    private final RapidApiClient rapidApiClient;
    private final MarketDataRepository marketDataRepository;

    @PostConstruct
    public void initializeMarketData() {
        log.info("Initializing ExchangeRate-API market data on startup");
        refreshMarketData();
    }

    public MarketSnapshotDTO getMarketSnapshot() {
        log.info("Fetching ExchangeRate-API market snapshot");
        MarketSnapshotDTO snapshot = new MarketSnapshotDTO();

        // Populate all 3 currency slots from the database fallback pattern
        snapshot.setUsdInr(getCurrencyQuoteFromDB("USD/INR", "USD / INR"));
        snapshot.setEurInr(getCurrencyQuoteFromDB("EUR/INR", "EUR / INR"));
        snapshot.setGbpInr(getCurrencyQuoteFromDB("GBP/INR", "GBP / INR"));

        snapshot.setNifty50(unavailableQuote("NIFTY 50", "NSE:NIFTY", "INDIA"));
        snapshot.setBankNifty(unavailableQuote("Bank Nifty", "NSE:BANKNIFTY", "INDIA"));
        snapshot.setSensex(unavailableQuote("Sensex", "INDEXBOM:SENSEX", "INDIA"));
        snapshot.setGold(unavailableQuote("Gold", "MCX:GOLD1!", "COMMODITY"));
        return snapshot;
    }

    /** 💸 Core Worker: Fetches base USD payload and calculates target cross-rates */
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

                    // Calculate EUR/INR cross rate (Base USD_INR / Base USD_EUR)
                    if (rates.has("EUR")) {
                        double eurInr = usdInr / rates.get("EUR").asDouble();
                        saveMarketData("EUR/INR", "CURRENCY", "EUR / INR", eurInr, "ExchangeRate-API");
                    }

                    // Calculate GBP/INR cross rate (Base USD_INR / Base USD_GBP)
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
}