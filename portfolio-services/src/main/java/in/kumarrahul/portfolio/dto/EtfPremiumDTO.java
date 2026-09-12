package in.kumarrahul.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtfPremiumDTO {
    private String ticker;
    private String name;
    private Double marketPrice;
    private Double navPrice;
    private Double premiumPercent;
    private String status;
    private String message;
    private String source;
    private String lastUpdated;
}
