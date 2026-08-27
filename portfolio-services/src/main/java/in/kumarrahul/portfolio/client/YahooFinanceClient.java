package in.kumarrahul.portfolio.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class YahooFinanceClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
    private static final String API_KEY = "demo"; // Get from https://finnhub.io

    public JsonNode getStockQuote(String symbol) {
        try {
            // Using Finnhub API (more reliable than Yahoo Finance direct API)
            String url = String.format("%s/quote?symbol=%s&token=%s",
                    FINNHUB_BASE_URL, symbol, API_KEY);

            log.debug("Fetching stock quote for: {}", symbol);
            String response = restTemplate.getForObject(url, String.class);
            JsonNode data = objectMapper.readTree(response);

            // Finnhub response: {"c": 2150.50, "d": 12.34, "dp": 1.01, "h": 2160, "l": 2140, "o": 2140, "pc": 2137, "t": 1693151000}
            if (data.has("c")) {
                log.info("Successfully fetched quote for {}: {}", symbol, data.get("c"));
                return data;
            }

            log.warn("No quote data in response for symbol: {}", symbol);
            return null;
        } catch (Exception e) {
            log.error("Error fetching stock quote for {}", symbol, e);
            return null;
        }
    }
}