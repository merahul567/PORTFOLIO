package in.kumarrahul.portfolio.repository;

import in.kumarrahul.portfolio.entity.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    Optional<MarketData> findBySymbol(String symbol);
}
