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
        log.info("================================");
        log.info("Initializing ExchangeRate-API market data on startup");
        log.info("================================");
        refreshMarketData();
    }

    public MarketSnapshotDTO getMarketSnapshot() {
        log.info("Fetching ExchangeRate-API market snapshot");
        MarketSnapshotDTO snapshot = new MarketSnapshotDTO();
        snapshot.setUsdInr(fetchUsdInr());
        snapshot.setNifty50(unavailableQuote("NIFTY 50", "NSE:NIFTY", "INDIA"));
        snapshot.setBankNifty(unavailableQuote("Bank Nifty", "NSE:BANKNIFTY", "INDIA"));
        snapshot.setSensex(unavailableQuote("Sensex", "INDEXBOM:SENSEX", "INDIA"));
        snapshot.setGold(unavailableQuote("Gold", "MCX:GOLD1!", "COMMODITY"));
        return snapshot;
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

    private MarketQuoteDTO fetchUsdInr() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("USD/INR");
        quote.setName("USD / INR");
        quote.setCategory("CURRENCY");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch USD/INR from ExchangeRate-API...");
            JsonNode data = rapidApiClient.getForexData("USD", "INR");

            if (data != null && data.has("conversion_rates") && data.get("conversion_rates").has("INR")) {
                double rate = data.get("conversion_rates").get("INR").asDouble();
                quote.setCurrentPrice(rate);
                quote.setStatus("Available");
                quote.setSource("ExchangeRate-API");
                quote.setChange(0.0);
                quote.setChangePercent(0.0);

                saveMarketData("USD/INR", "CURRENCY", "USD / INR", rate, 0.0, 0.0, "ExchangeRate-API");
                log.info("✅ USD/INR fetched successfully: {}", rate);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from ExchangeRate-API");
                log.warn("⚠️ USD/INR API returned no data. Response: {}", data);
            }
        } catch (Exception e) {
            log.error("❌ Error fetching USD/INR: {}", e.getMessage());
            quote.setStatus("Unavailable");
            quote.setMessage("Error: " + e.getMessage());
        }

        return quote;
    }

    private void saveMarketData(String symbol, String category, String name, Double price,
                                Double change, Double changePercent, String source) {
        try {
            MarketData marketData = marketDataRepository.findBySymbol(symbol)
                    .orElse(new MarketData());

            marketData.setSymbol(symbol);
            marketData.setCategory(category);
            marketData.setName(name);
            marketData.setCurrentPrice(price);
            marketData.setChange(change);
            marketData.setChangePercent(changePercent);
            marketData.setTimestamp(LocalDateTime.now());
            marketData.setSource(source);

            marketDataRepository.save(marketData);
            log.debug("💾 Saved to database: {} - {}", symbol, price);
        } catch (Exception e) {
            log.error("❌ Error saving market data for {}: {}", symbol, e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 300000)
    public void refreshMarketData() {
        log.info("================================");
        log.info("⏰ SCHEDULED REFRESH: Refreshing ExchangeRate-API data");
        log.info("================================");
        try {
            MarketSnapshotDTO snapshot = getMarketSnapshot();
            log.info("✅ Market snapshot refreshed with ExchangeRate-API data");
            if (snapshot.getUsdInr() != null) {
                log.info("USD/INR: {}", snapshot.getUsdInr().getStatus());
            }
        } catch (Exception e) {
            log.error("❌ Error in scheduled market data refresh: {}", e.getMessage(), e);
        }
    }
}