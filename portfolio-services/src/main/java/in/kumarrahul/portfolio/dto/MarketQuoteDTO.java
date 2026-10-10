package in.kumarrahul.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketQuoteDTO {
    private String symbol;
    private String category;
    private String name;
    private Double currentPrice;
    private Double change;
    private Double changePercent;
    private String timestamp;
    private String source;
    private String status; // "Unavailable", "Available"
    private String message;
}
