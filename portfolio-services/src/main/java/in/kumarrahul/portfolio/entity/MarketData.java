package in.kumarrahul.portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "symbol", nullable = false, unique = true)
    private String symbol;
    
    @Column(name = "category", nullable = false)
    private String category; // COMMODITY, INDIA_STOCK, GLOBAL_STOCK, CURRENCY
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "current_price")
    private Double currentPrice;
    
    @Column(name = "change")
    private Double change;
    
    @Column(name = "change_percent")
    private Double changePercent;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "source")
    private String source;
}
