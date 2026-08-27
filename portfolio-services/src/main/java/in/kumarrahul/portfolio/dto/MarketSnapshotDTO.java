package in.kumarrahul.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketSnapshotDTO {
    private MarketQuoteDTO gold;
    private MarketQuoteDTO nifty50;
    private MarketQuoteDTO sensex;
    private MarketQuoteDTO nasdaq;
    private MarketQuoteDTO usdInr;
}
