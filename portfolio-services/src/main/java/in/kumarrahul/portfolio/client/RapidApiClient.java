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
public class RapidApiClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public JsonNode getMetalsData() {
        try {
            // Using corrected Metals.live API endpoint
            String url = "https://api.metals.live/v1/spot/gold";

            log.debug("Fetching gold price from Metals.live");
            String response = restTemplate.getForObject(url, String.class);
            JsonNode data = objectMapper.readTree(response);

            // Response format: {"gold": 2150.50}
            if (data.has("gold")) {
                log.info("Successfully fetched gold price");
                return data;
            }
            log.warn("Unexpected response from Metals API: {}", response);
            return null;
        } catch (Exception e) {
            log.error("Error fetching metals data from Metals.live", e);
            return null;
        }
    }

    public JsonNode getForexData(String baseCurrency, String targetCurrency) {
        try {
            // Using ExchangeRate-API (working well)
            String url = String.format("https://api.exchangerate-api.com/v4/latest/%s", baseCurrency);

            log.debug("Fetching forex {} to {}", baseCurrency, targetCurrency);
            String response = restTemplate.getForObject(url, String.class);
            JsonNode data = objectMapper.readTree(response);

            if (data.has("rates")) {
                log.info("Successfully fetched forex rates for {}", baseCurrency);
                return data;
            }
            return null;
        } catch (Exception e) {
            log.error("Error fetching forex data", e);
            return null;
        }
    }
}