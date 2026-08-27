package in.kumarrahul.portfolio.service;

import in.kumarrahul.portfolio.client.AlphaVantageClient;
import in.kumarrahul.portfolio.client.RapidApiClient;
import in.kumarrahul.portfolio.client.YahooFinanceClient;
import in.kumarrahul.portfolio.dto.MarketQuoteDTO;
import in.kumarrahul.portfolio.dto.MarketSnapshotDTO;
import in.kumarrahul.portfolio.entity.MarketData;
import in.kumarrahul.portfolio.repository.MarketDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {

    private final AlphaVantageClient alphaVantageClient;
    private final RapidApiClient rapidApiClient;
    private final YahooFinanceClient yahooFinanceClient;
    private final MarketDataRepository marketDataRepository;

    @PostConstruct
    public void initializeMarketData() {
        log.info("================================");
        log.info("Initializing market data on startup");
        log.info("================================");
        refreshMarketData();
    }

    public MarketSnapshotDTO getMarketSnapshot() {
        log.info("Fetching market snapshot");
        MarketSnapshotDTO snapshot = new MarketSnapshotDTO();

        snapshot.setGold(fetchGoldPrice());
        snapshot.setNifty50(fetchNifty50());
        snapshot.setSensex(fetchSensex());
        snapshot.setNasdaq(fetchNASDAQ());
        snapshot.setUsdInr(fetchUsdInr());

        return snapshot;
    }

    private MarketQuoteDTO fetchGoldPrice() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("GOLD");
        quote.setName("Gold");
        quote.setCategory("COMMODITY");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch gold price from Metals.live...");
            JsonNode data = rapidApiClient.getMetalsData();

            if (data != null && data.has("gold")) {
                double goldPrice = data.get("gold").asDouble();
                quote.setCurrentPrice(goldPrice);
                quote.setStatus("Available");
                quote.setSource("Metals.live API");
                quote.setChange(0.0);
                quote.setChangePercent(0.0);

                saveMarketData("GOLD", "COMMODITY", "Gold", goldPrice, 0.0, 0.0, "Metals.live");
                log.info("✅ Gold price fetched successfully: ${}", goldPrice);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from API");
                log.warn("⚠️ Gold API returned no data. Response: {}", data);
            }
        } catch (Exception e) {
            log.error("❌ Error fetching gold price: {}", e.getMessage());
            quote.setStatus("Unavailable");
            quote.setMessage("Error: " + e.getMessage());
        }

        return quote;
    }

    private MarketQuoteDTO fetchNifty50() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("^NSEI");
        quote.setName("Nifty 50");
        quote.setCategory("INDIA");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch Nifty 50 (^NSEI) from Finnhub...");
            JsonNode data = yahooFinanceClient.getStockQuote("^NSEI");

            if (data != null && data.has("c")) {
                double price = data.get("c").asDouble();
                double change = data.has("d") ? data.get("d").asDouble() : 0.0;
                double changePercent = data.has("dp") ? data.get("dp").asDouble() : 0.0;

                quote.setCurrentPrice(price);
                quote.setChange(change);
                quote.setChangePercent(changePercent);
                quote.setStatus("Available");
                quote.setSource("Finnhub API");

                saveMarketData("^NSEI", "INDIA", "Nifty 50", price, change, changePercent, "Finnhub");
                log.info("✅ Nifty 50 fetched successfully: {} (Change: {} / {}%)", price, change, changePercent);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from API");
                log.warn("⚠️ Nifty 50 API returned no data. Response: {}", data);
            }
        } catch (Exception e) {
            log.error("❌ Error fetching Nifty 50: {}", e.getMessage());
            quote.setStatus("Unavailable");
            quote.setMessage("Error: " + e.getMessage());
        }

        return quote;
    }

    private MarketQuoteDTO fetchSensex() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("^BSESN");
        quote.setName("Sensex");
        quote.setCategory("INDIA");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch Sensex (^BSESN) from Finnhub...");
            JsonNode data = yahooFinanceClient.getStockQuote("^BSESN");

            if (data != null && data.has("c")) {
                double price = data.get("c").asDouble();
                double change = data.has("d") ? data.get("d").asDouble() : 0.0;
                double changePercent = data.has("dp") ? data.get("dp").asDouble() : 0.0;

                quote.setCurrentPrice(price);
                quote.setChange(change);
                quote.setChangePercent(changePercent);
                quote.setStatus("Available");
                quote.setSource("Finnhub API");

                saveMarketData("^BSESN", "INDIA", "Sensex", price, change, changePercent, "Finnhub");
                log.info("✅ Sensex fetched successfully: {} (Change: {} / {}%)", price, change, changePercent);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from API");
                log.warn("⚠️ Sensex API returned no data. Response: {}", data);
            }
        } catch (Exception e) {
            log.error("❌ Error fetching Sensex: {}", e.getMessage());
            quote.setStatus("Unavailable");
            quote.setMessage("Error: " + e.getMessage());
        }

        return quote;
    }

    private MarketQuoteDTO fetchNASDAQ() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("^IXIC");
        quote.setName("NASDAQ");
        quote.setCategory("GLOBAL");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch NASDAQ (^IXIC) from Finnhub...");
            JsonNode data = yahooFinanceClient.getStockQuote("^IXIC");

            if (data != null && data.has("c")) {
                double price = data.get("c").asDouble();
                double change = data.has("d") ? data.get("d").asDouble() : 0.0;
                double changePercent = data.has("dp") ? data.get("dp").asDouble() : 0.0;

                quote.setCurrentPrice(price);
                quote.setChange(change);
                quote.setChangePercent(changePercent);
                quote.setStatus("Available");
                quote.setSource("Finnhub API");

                saveMarketData("^IXIC", "GLOBAL", "NASDAQ", price, change, changePercent, "Finnhub");
                log.info("✅ NASDAQ fetched successfully: {} (Change: {} / {}%)", price, change, changePercent);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from API");
                log.warn("⚠️ NASDAQ API returned no data. Response: {}", data);
            }
        } catch (Exception e) {
            log.error("❌ Error fetching NASDAQ: {}", e.getMessage());
            quote.setStatus("Unavailable");
            quote.setMessage("Error: " + e.getMessage());
        }

        return quote;
    }

    private MarketQuoteDTO fetchUsdInr() {
        MarketQuoteDTO quote = new MarketQuoteDTO();
        quote.setSymbol("USD/INR");
        quote.setName("USD / INR");
        quote.setCategory("CURRENCY");
        quote.setTimestamp(LocalDateTime.now().toString());

        try {
            log.info("Attempting to fetch USD/INR from ExchangeRate API...");
            JsonNode data = rapidApiClient.getForexData("USD", "INR");

            if (data != null && data.has("rates")) {
                double rate = data.get("rates").get("INR").asDouble();
                quote.setCurrentPrice(rate);
                quote.setStatus("Available");
                quote.setSource("ExchangeRate API");
                quote.setChange(0.0);
                quote.setChangePercent(0.0);

                saveMarketData("USD/INR", "CURRENCY", "USD / INR", rate, 0.0, 0.0, "ExchangeRate API");
                log.info("✅ USD/INR fetched successfully: {}", rate);
            } else {
                quote.setStatus("Unavailable");
                quote.setMessage("No data available from API");
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

    @Scheduled(fixedDelay = 300000) // 5 minutes
    public void refreshMarketData() {
        log.info("================================");
        log.info("⏰ SCHEDULED REFRESH: Refreshing market data (runs every 5 minutes)");
        log.info("================================");
        try {
            MarketSnapshotDTO snapshot = getMarketSnapshot();
            log.info("================================");
            log.info("✅ Market data refresh completed successfully");
            log.info("Gold: {}", snapshot.getGold().getStatus());
            log.info("Nifty 50: {}", snapshot.getNifty50().getStatus());
            log.info("Sensex: {}", snapshot.getSensex().getStatus());
            log.info("NASDAQ: {}", snapshot.getNasdaq().getStatus());
            log.info("USD/INR: {}", snapshot.getUsdInr().getStatus());
            log.info("================================");
        } catch (Exception e) {
            log.error("❌ Error in scheduled market data refresh: {}", e.getMessage(), e);
        }
    }
}