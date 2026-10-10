package in.kumarrahul.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketSnapshotDTO {
    private MarketQuoteDTO usdInr;
    private MarketQuoteDTO eurInr;
    private MarketQuoteDTO gbpInr;
    private MarketQuoteDTO nifty50;
    private MarketQuoteDTO bankNifty;
    private MarketQuoteDTO sensex;
    private MarketQuoteDTO gold;
}
