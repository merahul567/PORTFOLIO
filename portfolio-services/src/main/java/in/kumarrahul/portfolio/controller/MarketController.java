package in.kumarrahul.portfolio.controller;

import in.kumarrahul.portfolio.dto.MarketSnapshotDTO;
import in.kumarrahul.portfolio.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://www.kumarrahul.in", "https://kumarrahul.in"})
public class MarketController {
    
    private final MarketDataService marketDataService;
    
    @GetMapping("/snapshot")
    public ResponseEntity<MarketSnapshotDTO> getMarketSnapshot() {
        MarketSnapshotDTO snapshot = marketDataService.getMarketSnapshot();
        return ResponseEntity.ok(snapshot);
    }
}
