import React, { useState, useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';
import { Car, Activity, Layers, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import vehicleDataRaw from '../../vehicles.json';

// Cast imported JSON safely
const vehicleDb = vehicleDataRaw as Record<string, Record<string, number[]>>;

interface CreateJobWizardProps {
  onCancel: () => void;
}

const COMMON_SYMPTOMS = [
  'Engine Misfire',
  'Rough Idle',
  'Check Engine Light',
  'Transmission Slipping',
  'Lagging Shift',
  'Brake Squeak / Vibration',
  'ABS Warning Indicator',
  'Battery Drainage',
  'Alternator Malfunction',
  'Suspension Clunking',
  'AC Blowing Warm Air',
  'Coolant Leakage',
];

export const CreateJobWizard: React.FC<CreateJobWizardProps> = ({ onCancel }) => {
  const addJob = useJobStore((state) => state.addJob);
  const [step, setStep] = useState(1);

  // Form Fields
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');

  // Custom user input fields (when "other" option is selected)
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customYear, setCustomYear] = useState('');

  // Handle Make / Model / Year dependencies
  const makesList = Object.keys(vehicleDb).sort();
  const modelsList = make && make !== 'Other' && vehicleDb[make] ? Object.keys(vehicleDb[make]).sort() : [];
  const yearsList = make && make !== 'Other' && model && model !== 'Other' && vehicleDb[make]?.[model] ? vehicleDb[make][model] : [];

  // Reset dependent fields when parent fields change
  useEffect(() => {
    if (make !== 'Other') {
      setCustomMake('');
    }
    setModel('');
    setYear('');
  }, [make]);

  useEffect(() => {
    if (model !== 'Other') {
      setCustomModel('');
    }
    setYear('');
  }, [model]);

  useEffect(() => {
    if (year !== 'Other') {
      setCustomYear('');
    }
  }, [year]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = () => {
    const finalMake = make === 'Other' ? customMake : make;
    const finalModel = model === 'Other' ? customModel : model;
    const finalYear = year === 'Other' ? customYear : year;

    addJob({
      vehicleVin: vin,
      vehicleMake: finalMake,
      vehicleModel: finalModel,
      vehiclePlate: plate,
      vehicleYear: finalYear,
      priority,
      symptoms: selectedSymptoms,
      notes: notes,
    });
    onCancel();
  };

  // Validations
  const finalMake = make === 'Other' ? customMake : make;
  const finalModel = model === 'Other' ? customModel : model;
  const finalYear = year === 'Other' ? customYear : year;
  const isStep1Valid = vin.length > 5 && finalMake.trim() && finalModel.trim() && finalYear.trim() && plate.trim();
  const isStep2Valid = selectedSymptoms.length > 0;

  return (
    <div className="flex-1 p-8 overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Consultation Request</h2>
          <p className="text-slate-400 mt-1.5 font-medium">Request specialist help for a vehicle issue.</p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Cancel Request
        </button>
      </div>

      {/* Wizard Steps indicator */}
      <div className="flex items-center gap-4 mb-10 max-w-2xl">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${
              step >= s
                ? 'bg-orange-500 text-slate-950 border-orange-500'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {s}
            </div>
            <div className="flex-1">
              <p className={`text-xs font-bold uppercase tracking-wider ${
                step >= s ? 'text-white' : 'text-slate-600'
              }`}>
                Step {s}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                {s === 1 ? 'Specs' : s === 2 ? 'Faults' : 'Verify'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Form Area */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-8 max-w-3xl shadow-xl">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-500" />
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  VIN Number
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="e.g. 1FTFW1ED5KFD12345"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  License Plate
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="e.g. TN-01-AX-1234"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
                />
              </div>

              {/* Dropdown selects for Make */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Make
                </label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                >
                  <option value="">Select Make</option>
                  {makesList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value="Other">Other (Custom input)</option>
                </select>
              </div>

              {make === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Enter Custom Make
                  </label>
                  <input
                    type="text"
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    placeholder="e.g. Porsche"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                  />
                </div>
              )}

              {/* Model select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!make}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white disabled:opacity-40 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                >
                  <option value="">Select Model</option>
                  {make !== 'Other' && modelsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value="Other">Other (Custom input)</option>
                </select>
              </div>

              {model === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Enter Custom Model
                  </label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g. Taycan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                  />
                </div>
              )}

              {/* Year select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!model}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white disabled:opacity-40 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                >
                  <option value="">Select Year</option>
                  {make !== 'Other' && model !== 'Other' && yearsList.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                  <option value="Other">Other (Custom input)</option>
                </select>
              </div>

              {year === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Enter Custom Year
                  </label>
                  <input
                    type="text"
                    value={customYear}
                    onChange={(e) => setCustomYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                  />
                </div>
              )}

            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Priority Status
              </label>
              <div className="flex gap-4">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-3 px-4 border rounded-xl font-bold capitalize transition-all cursor-pointer ${
                      priority === p
                        ? p === 'high'
                          ? 'border-red-500/60 bg-red-950/40 text-red-400'
                          : p === 'medium'
                          ? 'border-amber-500/60 bg-amber-950/40 text-amber-400'
                          : 'border-slate-500/60 bg-slate-850 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Symptoms & Diagnostics
            </h3>

            {/* Checklist */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Select Common Symptoms
              </label>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? 'border-orange-500/50 bg-orange-950/20 text-orange-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-orange-500 bg-orange-500' : 'border-slate-650'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-slate-950 stroke-[3px]" />}
                      </div>
                      <span className="truncate">{sym}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Addition */}
            <form onSubmit={addCustomSymptom}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Or Add Custom Symptom
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="e.g. Engine ticking under load"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Diagnostic Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include DTC diagnostic trouble codes, parts swapped, testing steps already run..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              Verify & Submit Request
            </h3>

            <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-850">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Vehicle</span>
                  <p className="text-white font-extrabold mt-0.5">{finalMake} {finalModel} ({finalYear})</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Plate Number</span>
                  <p className="text-white font-bold mt-0.5">{plate}</p>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">VIN Specs</span>
                  <p className="text-white font-mono mt-0.5 text-xs tracking-wider">{vin}</p>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Severity</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    priority === 'high'
                      ? 'bg-red-950 text-red-400 border border-red-800/30'
                      : priority === 'medium'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800/30'
                  }`}>
                    {priority} Priority
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Identified Faults ({selectedSymptoms.length})</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selectedSymptoms.map((s) => (
                    <span key={s} className="px-3 py-1 bg-slate-900 border border-slate-850 rounded-lg text-xs font-semibold text-orange-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {notes && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Additional Notes</span>
                  <p className="text-slate-400 text-sm mt-1 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-4 border border-slate-850 rounded-lg">{notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              step === 1
                ? 'border-slate-800 text-slate-700 bg-transparent cursor-not-allowed'
                : 'border-slate-800 text-slate-300 bg-slate-950 hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                (step === 1 ? isStep1Valid : isStep2Valid)
                  ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10 active:scale-[0.98]'
                  : 'bg-slate-850 border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all text-sm cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
