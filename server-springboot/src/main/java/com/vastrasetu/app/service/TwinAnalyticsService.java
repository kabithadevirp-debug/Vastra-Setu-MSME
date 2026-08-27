package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.MonthlySustainabilitySnapshot;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TwinAnalyticsService {

    private final TwinSnapshotService snapshotService;

    public TwinAnalyticsService(TwinSnapshotService snapshotService) {
        this.snapshotService = snapshotService;
    }

    public List<Map<String, Object>> getTrendData(UUID msmeId) {
        List<MonthlySustainabilitySnapshot> snapshots = snapshotService.getOrGenerateSnapshots(msmeId);
        List<Map<String, Object>> list = new ArrayList<>();

        for (MonthlySustainabilitySnapshot s : snapshots) {
            Map<String, Object> m = new LinkedHashMap<>();
            String monthName = s.getSnapshotMonth() != null ? s.getSnapshotMonth().getMonth().name().substring(0, 3) : "N/A";
            m.put("month", monthName);
            m.put("snapshotMonth", s.getSnapshotMonth() != null ? s.getSnapshotMonth().toString() : "");
            m.put("carbonKg", s.getCarbonKgEstimated() != null ? Math.round(s.getCarbonKgEstimated() * 100.0) / 100.0 : 0.0);
            m.put("electricityKwh", s.getElectricityKwh() != null ? s.getElectricityKwh() : 0.0);
            m.put("waterLitres", s.getWaterLitres() != null ? s.getWaterLitres() : 0.0);
            m.put("productionUnits", s.getProductionUnits() != null ? s.getProductionUnits() : 0.0);
            list.add(m);
        }

        return list;
    }

    public Map<String, Object> predictNextMonth(UUID msmeId) {
        List<MonthlySustainabilitySnapshot> snapshots = snapshotService.getOrGenerateSnapshots(msmeId);
        int n = snapshots.size();

        if (n < 3) {
            Map<String, Object> res = new LinkedHashMap<>();
            res.put("hasEnoughData", false);
            res.put("dataCount", n);
            res.put("message", "Minimum 3 months of verified operational data required to compute AI regression predictions.");
            return res;
        }

        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = snapshots.get(i).getCarbonKgEstimated() != null ? snapshots.get(i).getCarbonKgEstimated() : 0.0;
            sumX += x;
            sumY += y;
            sumXY += (x * y);
            sumX2 += (x * x);
        }

        double denominator = (n * sumX2 - sumX * sumX);
        double slope = denominator != 0 ? (n * sumXY - sumX * sumY) / denominator : 0.0;
        double intercept = (sumY - slope * sumX) / n;
        double predictedNextY = slope * (n + 1) + intercept;
        double currentY = snapshots.get(n - 1).getCarbonKgEstimated() != null ? snapshots.get(n - 1).getCarbonKgEstimated() : 0.0;

        double pctChange = currentY > 0 ? ((predictedNextY - currentY) / currentY) * 100.0 : 0.0;
        String direction = slope < -5 ? "DOWN" : (slope > 5 ? "UP" : "STABLE");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("hasEnoughData", true);
        result.put("dataCount", n);
        result.put("predictedCarbonKg", Math.round(predictedNextY * 100.0) / 100.0);
        result.put("currentCarbonKg", Math.round(currentY * 100.0) / 100.0);
        result.put("trendDirection", direction);
        result.put("percentageChange", Math.round(pctChange * 10.0) / 10.0);
        result.put("methodology", "Least-squares linear regression model based on CEA India grid emission factor (0.716 kg CO2e/kWh)");
        return result;
    }

    public List<Map<String, Object>> generateRecommendations(UUID msmeId) {
        List<MonthlySustainabilitySnapshot> snapshots = snapshotService.getOrGenerateSnapshots(msmeId);
        List<Map<String, Object>> recs = new ArrayList<>();

        if (snapshots.isEmpty()) {
            return recs;
        }

        double latestKwh = snapshots.get(snapshots.size() - 1).getElectricityKwh() != null ? snapshots.get(snapshots.size() - 1).getElectricityKwh() : 0.0;
        double latestWater = snapshots.get(snapshots.size() - 1).getWaterLitres() != null ? snapshots.get(snapshots.size() - 1).getWaterLitres() : 0.0;

        if (latestKwh > 2000) {
            recs.add(Map.of(
                    "id", "REC-SOLAR-01",
                    "title", "Install 50 kW Rooftop Solar PV System",
                    "impact", "-30% Scope 2 Electricity Carbon Footprint",
                    "reasoning", String.format("Verified operational bills show %.0f kWh monthly grid usage. Solar adoption will reduce grid electricity demand by ~30%%.", latestKwh),
                    "potentialTrustScoreGain", "+4 Points"
            ));

            recs.add(Map.of(
                    "id", "REC-LED-02",
                    "title", "Factory Floor High-Bay LED Retrofit",
                    "impact", "-10% Electricity Consumption",
                    "reasoning", "Replacing legacy metal-halide lighting with high-bay LED fixtures lowers lighting kWh consumption across processing sheds.",
                    "potentialTrustScoreGain", "+2 Points"
            ));
        }

        if (latestWater > 50000) {
            recs.add(Map.of(
                    "id", "REC-ZLD-03",
                    "title", "CETP Closed-Loop RO Recirculation",
                    "impact", "92% ZLD Water Recovery",
                    "reasoning", String.format("Monthly effluent data shows %.0f L water consumption. RO permeate recirculation reduces freshwater withdrawal.", latestWater),
                    "potentialTrustScoreGain", "+3 Points"
            ));
        }

        return recs;
    }
}
