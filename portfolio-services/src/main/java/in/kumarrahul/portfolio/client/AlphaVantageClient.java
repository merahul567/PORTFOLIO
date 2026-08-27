package in.kumarrahul.portfolio.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AlphaVantageClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Using free Finnhub API alternative (more reliable than Alpha Vantage)
    // Get free key from https://finnhub.io (limit: 60 API calls/minute)
    private static final String FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
    private static final String FINNHUB_API_KEY = "demo"; // Replace with your key from finnhub.io

    public JsonNode getIndianStockQuote(String symbol) {
        try {
            // Use Finnhub for Indian stocks
            String url = String.format("%s/quote?symbol=%s&token=%s",
                    FINNHUB_BASE_URL, symbol, FINNHUB_API_KEY);

            log.debug("Fetching from Finnhub: {}", symbol);
            String response = restTemplate.getForObject(url, String.class);
            JsonNode data = objectMapper.readTree(response);

            if (data.has("c")) {
                log.info("Successfully fetched {} from Finnhub", symbol);
                return data;
            }
            return null;
        } catch (Exception e) {
            log.error("Error fetching quote for {} from Finnhub", symbol, e);
            return null;
        }
    }

    public JsonNode getGlobalQuote(String symbol) {
        try {
            // Use Finnhub for global stocks
            String url = String.format("%s/quote?symbol=%s&token=%s",
                    FINNHUB_BASE_URL, symbol, FINNHUB_API_KEY);

            log.debug("Fetching global quote: {}", symbol);
            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            log.error("Error fetching global quote for {}", symbol, e);
            return null;
        }
    }
}