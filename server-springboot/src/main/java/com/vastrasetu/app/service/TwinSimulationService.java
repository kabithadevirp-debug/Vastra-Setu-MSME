package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.MonthlySustainabilitySnapshot;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TwinSimulationService {

    private final TwinSnapshotService snapshotService;

    public TwinSimulationService(TwinSnapshotService snapshotService) {
        this.snapshotService = snapshotService;
    }

    public Map<String, Object> simulate(UUID msmeId, Map<String, Object> params) {
        boolean solar = Boolean.TRUE.equals(params.get("solarAdoption"));
        boolean led = Boolean.TRUE.equals(params.get("ledUpgrade"));
        boolean zld = Boolean.TRUE.equals(params.get("zldWaterRecycle"));

        List<MonthlySustainabilitySnapshot> snapshots = snapshotService.getOrGenerateSnapshots(msmeId);
        double baseKwh = snapshots.isEmpty() ? 3960.0 : snapshots.get(snapshots.size() - 1).getElectricityKwh();
        double baseWater = snapshots.isEmpty() ? 260000.0 : snapshots.get(snapshots.size() - 1).getWaterLitres();
        double baseCarbon = baseKwh * 0.716; // CEA India grid factor

        double elecReductionFactor = 1.0;
        if (solar) elecReductionFactor -= 0.30;
        if (led) elecReductionFactor -= 0.10;

        double waterReductionFactor = zld ? 0.75 : 1.0;

        double projectedKwh = baseKwh * elecReductionFactor;
        double projectedWater = baseWater * waterReductionFactor;
        double projectedCarbon = projectedKwh * 0.716;

        double carbonSavedKg = baseCarbon - projectedCarbon;
        double pctSaved = (carbonSavedKg / baseCarbon) * 100.0;

        int scoreDelta = 0;
        if (solar) scoreDelta += 4;
        if (led) scoreDelta += 2;
        if (zld) scoreDelta += 3;

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("baselineCarbonKg", Math.round(baseCarbon * 100.0) / 100.0);
        res.put("projectedCarbonKg", Math.round(projectedCarbon * 100.0) / 100.0);
        res.put("carbonSavedKg", Math.round(carbonSavedKg * 100.0) / 100.0);
        res.put("percentageReduction", Math.round(pctSaved * 10.0) / 10.0);
        res.put("baselineKwh", baseKwh);
        res.put("projectedKwh", projectedKwh);
        res.put("baselineWaterLitres", baseWater);
        res.put("projectedWaterLitres", projectedWater);
        res.put("trustScoreDelta", scoreDelta);
        res.put("projectedTrustScore", 94 + scoreDelta);
        res.put("note", "Simulation preview. Actual improvements will update live when new TNEB/CETP documents are uploaded.");
        return res;
    }
}
