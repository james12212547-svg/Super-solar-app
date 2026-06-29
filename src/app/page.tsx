"use client";

import { useState } from "react";
import { 
  ClipboardCheck, HardHat, Zap, Calculator, FileText, 
  AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, XCircle, ShieldCheck
} from "lucide-react";

export default function ProSolarEstimator() {
  const [activeTab, setActiveTab] = useState("site");

  // Form State
  const [buildYear, setBuildYear] = useState("after_2010");
  const [roofArea, setRoofArea] = useState("");
  const [grounding, setGrounding] = useState("");
  const [monthlyBill, setMonthlyBill] = useState(0);
  const [panelType, setPanelType] = useState("topcon");
  const [safetyChecks, setSafetyChecks] = useState<Record<string, boolean>>({ afci: false, islanding: false, approved: false });
  const [systemType, setSystemType] = useState("on_grid");
  const [hasETax, setHasETax] = useState(false);

  // Computed Values
  const recommendedKw = monthlyBill > 0 ? (monthlyBill / 600).toFixed(1) : "0.0";
  const showDeadLoadWarning = buildYear === "before_2010";
  const needA1Form = Number(roofArea) >= 160;
  const groundingFailed = grounding !== "" && Number(grounding) > 5;
  const slowRoiWarning = monthlyBill > 0 && monthlyBill < 3000;

  const panelInfo: Record<string, any> = {
    mono: { name: "Mono PERC (P-type)", eff: "20.5-22%", deg: "0.45-0.50%/ปี" },
    topcon: { name: "TOPCon (N-type)", eff: "22-24.5%", deg: "0.35-0.40%/ปี", highlight: "Recommended (คุ้มค่าสุดในไทย ทนร้อนดี)" },
    hjt: { name: "HJT (N-type)", eff: "24-25.5%", deg: "0.25-0.30%/ปี" },
  };

  const tabs = [
    { id: "site", label: "Site Assessment", icon: <HardHat size={18} /> },
    { id: "design", label: "System Design", icon: <Zap size={18} /> },
    { id: "finance", label: "Financial & Regulatory", icon: <Calculator size={18} /> },
    { id: "report", label: "Executive Report", icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 border-b border-zinc-800 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg text-zinc-950">
            <ClipboardCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Pro Solar Estimator</h1>
            <p className="text-zinc-500 text-sm">Engineering & Site Assessment Tool</p>
          </div>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-zinc-500">
          <p>Standard: PEA/MEA Approved 2026</p>
          <p>Tariff: Progressive Rate 2569</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap font-medium text-sm
                ${activeTab === tab.id 
                  ? "bg-amber-500/10 text-amber-500 border-l-4 border-amber-500" 
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 border-l-4 border-transparent"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: Site Assessment */}
          {activeTab === "site" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <HardHat className="text-amber-500" /> ประเมินโครงสร้างและพื้นที่
                </h2>

                <div className="space-y-6">
                  {/* Build Year */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-semibold">ปีที่สร้างอาคาร</label>
                    <select 
                      value={buildYear} 
                      onChange={(e) => setBuildYear(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    >
                      <option value="after_2010">สร้างหลังปี ค.ศ. 2010 (พ.ศ. 2553)</option>
                      <option value="before_2010">สร้างก่อนปี ค.ศ. 2010 (พ.ศ. 2553)</option>
                    </select>
                    {showDeadLoadWarning && (
                      <div className="mt-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg flex gap-3 text-amber-400">
                        <AlertTriangle className="shrink-0" />
                        <div>
                          <strong className="block mb-1">WARNING: Structural Dead Load</strong>
                          <p className="text-sm opacity-90">อาคารเก่าออกแบบรับ Dead Load เพียง 15-30 กก./ตร.ม. แผงโซล่ามีน้ำหนัก ~20 กก./ตร.ม. <strong className="text-white">แนะนำให้วิศวกรโยธาประเมินการเสริมโครงสร้าง (Truss Reinforcement) ก่อนติดตั้ง</strong></p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Roof Area */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-semibold">พื้นที่หลังคาที่ใช้ติดตั้ง (ตารางเมตร)</label>
                    <input 
                      type="number" 
                      placeholder="เช่น 120"
                      value={roofArea}
                      onChange={(e) => setRoofArea(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                    {roofArea !== "" && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm border ${needA1Form ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                        <FileText size={18} />
                        <span>เอกสารที่ต้องใช้: <strong>{needA1Form ? "ต้องขอใบ อ.1 (วิศวกรเซ็นรับรองโครงสร้าง)" : "สามารถแจ้งขอใบ อ.6 ได้เลย (พื้นที่ไม่เกินเกณฑ์)"}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Grounding */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-semibold">ผลวัดค่า Grounding (Ω)</label>
                    <input 
                      type="number" 
                      placeholder="ป้อนค่าความต้านทาน..."
                      value={grounding}
                      onChange={(e) => setGrounding(e.target.value)}
                      className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none ${groundingFailed ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-amber-500'}`}
                    />
                    {grounding !== "" && (
                      <div className={`mt-2 flex items-center gap-2 text-sm font-bold ${groundingFailed ? 'text-red-500' : 'text-emerald-500'}`}>
                        {groundingFailed ? <><XCircle size={16} /> STATUS: FAILED (ค่ามาตรฐานต้องไม่เกิน 5 โอห์ม แนะนำให้ตอกกราวด์รอตเพิ่ม)</> : <><CheckCircle2 size={16} /> STATUS: PASS (ค่ามาตรฐาน &lt; 5 โอห์ม)</>}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button onClick={() => setActiveTab('design')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">Next: System Design <ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: System Design */}
          {activeTab === "design" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <Zap className="text-emerald-500" /> ออกแบบระบบและเลือกวัสดุ
                </h2>

                <div className="space-y-6">
                  {/* System Sizing */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                    <label className="block text-sm text-zinc-400 mb-3 font-semibold">ค่าไฟเฉลี่ยรายเดือน (บาท) เพื่อประเมิน System Size</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <input 
                        type="number" 
                        value={monthlyBill || ''}
                        onChange={(e) => setMonthlyBill(Number(e.target.value))}
                        placeholder="เช่น 8000"
                        className="w-full sm:w-1/2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-lg focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="w-full sm:w-1/2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center">
                        <span className="text-zinc-400 text-sm block">ขนาดระบบแนะนำเบื้องต้น</span>
                        <span className="text-2xl font-black text-emerald-400">{recommendedKw} kWp</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel Selection */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-semibold">ชนิดแผง (Solar Module Type)</label>
                    <select 
                      value={panelType}
                      onChange={(e) => setPanelType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none mb-3"
                    >
                      <option value="mono">Mono PERC (P-type)</option>
                      <option value="topcon">TOPCon (N-type) - Recommended</option>
                      <option value="hjt">HJT (N-type)</option>
                    </select>
                    
                    <div className="bg-zinc-800/50 p-4 rounded-lg text-sm border border-zinc-700">
                      <p className="font-bold text-white mb-2">{panelInfo[panelType].name}</p>
                      <ul className="text-zinc-400 space-y-1">
                        <li>• ประสิทธิภาพการผลิต: <span className="text-white">{panelInfo[panelType].eff}</span></li>
                        <li>• อัตราการเสื่อมสภาพ: <span className="text-white">{panelInfo[panelType].deg}</span></li>
                      </ul>
                      {panelInfo[panelType].highlight && (
                        <p className="text-emerald-400 font-semibold mt-2 flex items-center gap-1"><ShieldCheck size={16}/> {panelInfo[panelType].highlight}</p>
                      )}
                    </div>
                  </div>

                  {/* Safety Checklist */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-3 font-semibold">Safety & Compliance Checklist</label>
                    <div className="space-y-3">
                      {[
                        { id: 'approved', label: 'Inverter อยู่ใน Approved List (PEA/MEA)' },
                        { id: 'afci', label: 'มีระบบป้องกัน DC Arc (AFCI ตามมาตรฐาน IEC 63027)' },
                        { id: 'islanding', label: 'ระบบ Anti-islanding ทำงานปกติ (ปลดวงจรภายใน 2 วินาที)' }
                      ].map(check => (
                        <label key={check.id} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={safetyChecks[check.id]}
                            onChange={(e) => setSafetyChecks({...safetyChecks, [check.id]: e.target.checked})}
                            className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 bg-zinc-900"
                          />
                          <span className={safetyChecks[check.id] ? "text-white" : "text-zinc-400"}>{check.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setActiveTab('site')} className="text-zinc-500 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button onClick={() => setActiveTab('finance')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">Next: Finance <ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Financial & Regulatory */}
          {activeTab === "finance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <Calculator className="text-blue-500" /> ความคุ้มค่าและกฎหมาย
                </h2>

                <div className="space-y-6">
                  {/* System Type */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-semibold">รูปแบบการเชื่อมต่อระบบ</label>
                    <select 
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="on_grid">On-Grid (คืนทุน 4-6 ปี, มี Net Billing)</option>
                      <option value="hybrid">Hybrid (รองรับแบตเตอรี่, คุ้มครองไฟตก)</option>
                      <option value="off_grid">Off-Grid (อิสระ 100%, ไม่เชื่อมการไฟฟ้า)</option>
                    </select>
                  </div>

                  {/* Regulatory Info */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                    <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">Regulatory Checks (อัปเดต 2569)</h3>
                    
                    {slowRoiWarning && (
                      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-3 text-sm">
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                        <div className="text-red-400">
                          <strong className="block mb-1">WARNING: ROI ต่ำกว่าเกณฑ์ (Tariff Revolution 2569)</strong>
                          <p className="opacity-90">เนื่องจากนโยบายค่าไฟก้าวหน้า 200 หน่วยแรก ไม่เกิน 3 บาท ลูกค้าที่ค่าไฟ &lt; 3,000 บาท จะมีระยะเวลาคืนทุนยาวนานกว่าปกติ (อาจถึง 8-10 ปี) แนะนำให้แจ้งลูกค้าก่อนเสนอราคา</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                      <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                      <div>
                        <strong>Net Billing Policy:</strong> รับซื้อคืน 2.20 บาท/หน่วย สัญญา 10 ปี (จำกัดเสนอขายไม่เกิน 5 kW สำหรับไฟ 1 เฟส)
                      </div>
                    </div>

                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${hasETax ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}>
                      <input 
                        type="checkbox" 
                        checked={hasETax}
                        onChange={(e) => setHasETax(e.target.checked)}
                        className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-950"
                      />
                      <div>
                        <strong className={hasETax ? "text-emerald-400" : "text-zinc-300"}>บริษัทสามารถออก e-Tax Invoice ได้</strong>
                        <p className="text-xs text-zinc-500 mt-1">จำเป็นสำหรับการใช้สิทธิลดหย่อนภาษี 200,000 บาท (มติ ครม.)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setActiveTab('design')} className="text-zinc-500 hover:text-white px-4 py-2 font-medium transition-colors">Back</button>
                  <button onClick={() => setActiveTab('report')} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-2 rounded-lg font-black flex items-center gap-2 transition-colors">Generate Report <ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Executive Report */}
          {activeTab === "report" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-zinc-100 border border-zinc-300 rounded-sm p-8 md:p-12 shadow-2xl text-zinc-900 max-w-3xl mx-auto">
                <div className="border-b-4 border-zinc-900 pb-6 mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Executive Site Report</h2>
                    <p className="text-zinc-500 font-medium">Pro Solar Estimator - Engineer Output</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold bg-zinc-900 text-white px-3 py-1 rounded">Status: Draft</p>
                    <p className="text-xs text-zinc-500 mt-2">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Site Summary */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-zinc-300 pb-1"><HardHat size={18}/> Site Conditions</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Build Year:</span>
                        <span className="font-semibold">{buildYear === 'before_2010' ? 'Pre-2010' : 'Post-2010'}</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Structural Warning:</span>
                        <span className={`font-semibold ${showDeadLoadWarning ? 'text-amber-600' : 'text-emerald-600'}`}>{showDeadLoadWarning ? 'Check Dead Load' : 'Pass'}</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Roof Area:</span>
                        <span className="font-semibold">{roofArea || '0'} sq.m.</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Required Permit:</span>
                        <span className="font-semibold">{needA1Form ? 'อ.1 (ดัดแปลงอาคาร)' : 'อ.6 (แจ้งยกเว้น)'}</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span className="text-zinc-600">Grounding Test:</span>
                        <span className={`font-bold ${groundingFailed ? 'text-red-600' : 'text-emerald-600'}`}>{grounding ? `${grounding} Ω` : 'N/A'} {groundingFailed && '(FAILED)'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* System Summary */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-zinc-300 pb-1"><Zap size={18}/> System Design</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Target Size:</span>
                        <span className="font-semibold text-lg">{recommendedKw} kWp</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Module Tech:</span>
                        <span className="font-semibold">{panelInfo[panelType].name}</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">System Type:</span>
                        <span className="font-semibold capitalize">{systemType.replace('_', '-')}</span>
                      </li>
                    </ul>
                    
                    <div className="mt-4 bg-zinc-100 border border-zinc-300 p-3 rounded">
                      <p className="text-xs font-bold text-zinc-500 mb-2 uppercase">Safety Compliance</p>
                      <div className="flex justify-between text-xs font-medium">
                        <span className={safetyChecks.approved ? 'text-emerald-600' : 'text-red-500'}>Inverter: {safetyChecks.approved ? 'Pass' : 'Fail'}</span>
                        <span className={safetyChecks.afci ? 'text-emerald-600' : 'text-red-500'}>AFCI: {safetyChecks.afci ? 'Pass' : 'Fail'}</span>
                        <span className={safetyChecks.islanding ? 'text-emerald-600' : 'text-red-500'}>Islanding: {safetyChecks.islanding ? 'Pass' : 'Fail'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 text-white p-5 rounded-lg">
                  <h3 className="font-bold mb-3 border-b border-zinc-700 pb-2">Financial & Policy Flags</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-zinc-400">ROI Status</span>
                      <span className={`font-bold ${slowRoiWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {slowRoiWarning ? 'Slow (Low usage)' : 'Optimal'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-zinc-400">Tax Benefit Eligibility</span>
                      <span className={`font-bold flex items-center gap-1 ${hasETax && systemType !== 'off_grid' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {hasETax && systemType !== 'off_grid' ? <><CheckCircle2 size={16}/> 200k Eligible</> : <><XCircle size={16}/> Not Eligible</>}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-xs text-zinc-500">
                  <p>Generated by Pro Solar Estimator App</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
