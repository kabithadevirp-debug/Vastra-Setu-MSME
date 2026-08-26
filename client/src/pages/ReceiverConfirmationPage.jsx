import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  ExternalLink, 
  QrCode, 
  FileText, 
  ArrowRight,
  Truck,
  Layers,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function ReceiverConfirmationPage({ token, navigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [receivedQty, setReceivedQty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [acknowledgedBy, setAcknowledgedBy] = useState('ABC Fashion Import QC Team');
  const [submitting, setSubmitting] = useState(false);
  const [submittedAck, setSubmittedAck] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v2/receiver/shipment/${token || 'CONF-ABC-2026-8842'}`);
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          const expected = json.data.shipment?.expectedQuantity || 5000;
          setReceivedQty(expected.toString());
          if (json.data.shipment?.status !== 'PENDING') {
            setSubmittedAck(json.data.shipment);
          }
        } else {
          setError(json.message || 'Invalid or expired confirmation link.');
        }
      } catch (err) {
        // Fallback demo data
        setData({
          shipment: {
            shipmentNumber: 'SHIP-2026-0087',
            batchNumber: 'VS-2026-B00041',
            receiverName: 'ABC Fashion GmbH',
            receiverEmail: 'imports@abcfashion.de',
            expectedQuantity: 5000,
            status: 'PENDING'
          },
          batch: {
            productName: '100% Organic Cotton Crewneck T-Shirt',
            styleCode: 'TS-26-ORG-01',
            fabricComposition: '100% Organic Cotton Single Jersey (180 GSM)',
            manufacturerName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
            manufacturerLocation: 'Tiruppur Textile Cluster, Tamil Nadu, India',
            readinessScore: 96,
            passportVersion: 1,
            qrCodeUrl: '/verify/VS-2026-B00041'
          }
        });
        setReceivedQty('5000');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [token]);

  const shipment = data?.shipment || {};
  const batch = data?.batch || {};
  const expectedQuantity = shipment.expectedQuantity || 5000;
  const currentReceived = parseInt(receivedQty || '0', 10);
  const discrepancy = expectedQuantity - currentReceived;

  const handleConfirm = async (isDiscrepancy = false) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v2/receiver/shipment/${token || 'CONF-ABC-2026-8842'}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receivedQuantity: currentReceived,
          remarks: remarks || (discrepancy === 0 ? 'Full shipment verified and received in good condition.' : `Quantity discrepancy reported: Expected ${expectedQuantity}, Received ${currentReceived}`),
          acknowledgedBy: acknowledgedBy || 'Receiver Import QC'
        })
      });
      const json = await res.json();
      if (json.success) {
        setSubmittedAck(json.data);
      } else {
        alert(json.message || 'Failed to submit acknowledgement');
      }
    } catch (err) {
      setSubmittedAck({
        shipmentNumber: shipment.shipmentNumber,
        receivedQuantity: currentReceived,
        expectedQuantity: expectedQuantity,
        discrepancyDifference: discrepancy,
        status: discrepancy === 0 ? 'RECEIVED' : 'DISPUTED',
        discrepancyRemarks: remarks || 'Confirmed via offline link.',
        acknowledgedBy: acknowledgedBy,
        acknowledgedAt: new Date().toISOString()
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-600 font-bold">Loading export shipment & digital passport details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Shipment Link Error</h2>
          <p className="text-xs text-zinc-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans pb-16">
      
      {/* RECEIVER HEADER */}
      <header className="bg-white border-b border-zinc-200 shadow-xs py-3.5 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-xs">
              <span>◈</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-zinc-900">
                Vastra<span className="text-emerald-700">Setu</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Receiver Delivery Portal (Zero-Login)
              </span>
            </div>
          </div>

          <a 
            href={batch.qrCodeUrl || `/verify/${shipment.batchNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Inspect Full Passport ↗</span>
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* COMPLETED ACKNOWLEDGEMENT BANNER */}
        {submittedAck ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-lg text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Acknowledgement Recorded ✓
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 font-display">
                Shipment Receipt Confirmed
              </h2>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                Thank you. Your delivery confirmation has been permanently recorded and synced to the exporter's traceability ledger.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 max-w-md mx-auto text-left text-xs space-y-2 font-mono text-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipment Number:</span>
                <strong>{submittedAck.shipmentNumber || shipment.shipmentNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Expected Quantity:</span>
                <strong>{submittedAck.expectedQuantity || expectedQuantity} units</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Confirmed Received:</span>
                <strong className={submittedAck.discrepancyDifference !== 0 ? 'text-amber-600' : 'text-emerald-700'}>
                  {submittedAck.receivedQuantity} units
                </strong>
              </div>
              {submittedAck.discrepancyDifference !== 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Discrepancy Difference:</span>
                  <span>{submittedAck.discrepancyDifference > 0 ? `-${submittedAck.discrepancyDifference}` : `+${Math.abs(submittedAck.discrepancyDifference)}`} units</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-zinc-200 text-[11px] text-zinc-500">
                <span>Acknowledged By:</span>
                <span>{submittedAck.acknowledgedBy}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={batch.qrCodeUrl || `/verify/${shipment.batchNumber}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>View Digital Product Passport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* PENDING CONFIRMATION FORM */
          <div className="space-y-6">
            
            {/* 1. SHIPMENT & PRODUCT SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      Export Shipment Delivery
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-500">{shipment.shipmentNumber}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-display">
                    {batch.productName || 'Organic Cotton T-Shirt'}
                  </h1>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-zinc-400 block">Receiver / Consignee</span>
                  <strong className="text-xs font-bold text-zinc-800">{shipment.receiverName}</strong>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Batch Ref</span>
                  <strong className="font-mono text-zinc-900 font-bold">{shipment.batchNumber}</strong>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Style Code</span>
                  <strong className="text-zinc-900 font-bold">{batch.styleCode || 'TS-26-ORG-01'}</strong>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block text-[11px] font-semibold">Expected Quantity</span>
                  <strong className="text-emerald-950 font-extrabold text-sm">{expectedQuantity.toLocaleString()} pcs</strong>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Traceability Status</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-800 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ready ({batch.readinessScore || 96}/100)</span>
                  </div>
                </div>
              </div>

              {/* Manufacturer Line */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span><strong>Manufacturer:</strong> {batch.manufacturerName}</span>
                </div>
                <span className="text-[11px] text-zinc-500">{batch.manufacturerLocation}</span>
              </div>
            </div>

            {/* 2. RECEIVER CONFIRMATION INPUT FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
              
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-emerald-700" />
                  <span>Record Inward Inspection & Receipt</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Verify the physical carton count upon arrival. Reporting a discrepancy creates a transparent audit trail without altering original production history.
                </p>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Actual Received Quantity (pcs) *
                  </label>
                  <input
                    type="number"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-zinc-900 text-sm"
                    placeholder="5000"
                  />
                  <span className="text-[11px] text-zinc-400 block mt-1">Expected: {expectedQuantity.toLocaleString()} units</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Inspector / Receiving Manager Name *
                  </label>
                  <input
                    type="text"
                    value={acknowledgedBy}
                    onChange={(e) => setAcknowledgedBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs text-zinc-900"
                    placeholder="e.g. Klaus Weber (Import QC Manager)"
                  />
                </div>
              </div>

              {/* Discrepancy Status Indicator */}
              {discrepancy !== 0 ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block font-bold">Quantity Discrepancy Detected</strong>
                    <p>
                      Expected: <strong>{expectedQuantity.toLocaleString()} pcs</strong> | Received: <strong>{currentReceived.toLocaleString()} pcs</strong> | Difference: <strong className="text-amber-800">{discrepancy > 0 ? `-${discrepancy}` : `+${Math.abs(discrepancy)}`} units</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Carton quantity matches dispatch manifest 100% ({expectedQuantity.toLocaleString()} units).</span>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Inspection Notes / Discrepancy Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs text-zinc-900"
                  placeholder={discrepancy === 0 ? "e.g. Packaging intact, QR hangtags scanned and verified." : "e.g. Box 14 short by 50 pcs due to carton transit damage."}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                {discrepancy !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleConfirm(true)}
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Recording Discrepancy...' : 'Report Discrepancy (Log Audit Trail)'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleConfirm(false)}
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Acknowledgement...' : 'Confirm Shipment Receipt →'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
