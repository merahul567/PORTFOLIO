package in.kumarrahul.portfolio.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class RapidApiClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.exchange-rate.api-key}")
    private String apiKey;

    @Value("${app.exchange-rate.base-url}")
    private String baseUrl;

    public JsonNode getForexData(String baseCurrency, String targetCurrency) {
        try {
            String url = String.format("%s/%s/latest/%s", baseUrl, apiKey, baseCurrency);
            log.debug("Fetching forex {} to {} from ExchangeRate-API", baseCurrency, targetCurrency);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode data = objectMapper.readTree(response);

            if (data != null && data.has("conversion_rates") && data.get("conversion_rates").has(targetCurrency)) {
                log.info("Successfully fetched ExchangeRate-API forex rates for {}", baseCurrency);
                return data;
            }

            log.warn("Unexpected ExchangeRate-API response for {} -> {}: {}", baseCurrency, targetCurrency, response);
            return null;
        } catch (Exception e) {
            log.error("Error fetching forex data from ExchangeRate-API", e);
            return null;
        }
    }
}