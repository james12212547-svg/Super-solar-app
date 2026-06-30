"use client";

import { useState } from "react";
import { 
  ClipboardCheck, HardHat, Zap, Calculator, FileText, 
  AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, XCircle, ShieldCheck,
  Camera, Upload, Info, Sun, Activity
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function ProSolarEstimator() {
  const [activeTab, setActiveTab] = useState("site");

  // --- TAB 1: Site Assessment ---
  // Roof Structure
  const [buildYear, setBuildYear] = useState("after_2010");
  const [roofArea, setRoofArea] = useState("");
  // New Physical Roof Data
  const [azimuth, setAzimuth] = useState("180");
  const [tilt, setTilt] = useState("15");
  const [roofMat, setRoofMat] = useState("metal_sheet");
  const [shading, setShading] = useState("none");
  
  // Existing Electrical Infrastructure
  const [grounding, setGrounding] = useState("");
  const [meterSize, setMeterSize] = useState("1p_15_45");
  const [mainBreaker, setMainBreaker] = useState("");
  const [spareSlot, setSpareSlot] = useState("yes");
  const [cableDist, setCableDist] = useState("");
  
  // Photo Evidence
  const [photos, setPhotos] = useState<Record<string, boolean>>({ roof: false, mdb: false, meter: false });

  // --- TAB 2: System Design ---
  const [monthlyBill, setMonthlyBill] = useState(0);
  const [panelType, setPanelType] = useState("topcon");
  const [safetyChecks, setSafetyChecks] = useState<Record<string, boolean>>({ afci: false, islanding: false, approved: false });

  // --- TAB 3: Finance & Regulatory ---
  const [systemType, setSystemType] = useState("on_grid");
  const [hasETax, setHasETax] = useState(false);
  const [docs, setDocs] = useState<Record<string, boolean>>({ sld: false, inverterTest: false });

  // Computed Values
  const recommendedKw = monthlyBill > 0 ? (monthlyBill / 600).toFixed(1) : "0.0";
  const showDeadLoadWarning = buildYear === "before_2010";
  const needA1Form = Number(roofArea) >= 160;
  const groundingFailed = grounding !== "" && Number(grounding) > 5;
  const slowRoiWarning = monthlyBill > 0 && monthlyBill < 3000;
  
  const isBestAzimuth = azimuth === "180" || azimuth === "200" || azimuth === "160";

  const panelInfo: Record<string, any> = {
    mono: { name: "Mono PERC (P-type)", eff: "20.5-22%", deg: "0.45-0.50%/ปี" },
    topcon: { name: "TOPCon (N-type)", eff: "22-24.5%", deg: "0.35-0.40%/ปี", highlight: "Recommended (คุ้มค่าสุดในไทย ทนร้อนดี)" },
    hjt: { name: "HJT (N-type)", eff: "24-25.5%", deg: "0.25-0.30%/ปี" },
  };

  // Chart Data Mockup (Load vs Solar Gen for a typical 5kWp system)
  const chartData = [
    { time: '06:00', load: 1.2, solar: 0 },
    { time: '08:00', load: 1.5, solar: 1.2 },
    { time: '10:00', load: 1.8, solar: 3.5 },
    { time: '12:00', load: 2.2, solar: 4.8 },
    { time: '14:00', load: 2.0, solar: 4.2 },
    { time: '16:00', load: 1.6, solar: 2.0 },
    { time: '18:00', load: 2.5, solar: 0.2 },
  ];

  const tabs = [
    { id: "site", label: "Site Assessment", icon: <HardHat size={18} /> },
    { id: "design", label: "System Design", icon: <Zap size={18} /> },
    { id: "finance", label: "Financial & Regulatory", icon: <Calculator size={18} /> },
    { id: "report", label: "Executive Report", icon: <FileText size={18} /> },
  ];

  const togglePhoto = (key: string) => {
    setPhotos({...photos, [key]: !photos[key]});
  };

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
            <p className="text-zinc-500 text-sm">Advanced Engineering App</p>
          </div>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-zinc-500">
          <p>Standard: PEA/MEA Approved 2026</p>
          <p>Build Ver: 4.0.0 (Pro)</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
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
        <div className="flex-1 min-w-0 pb-20">
          
          {/* TAB 1: Site Assessment */}
          {activeTab === "site" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Photo Evidence */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <Camera className="text-blue-500" /> Photo Evidence (Site Survey)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'roof', label: 'สภาพหลังคา', icon: <Sun size={20}/> },
                    { id: 'mdb', label: 'ตู้โหลดเซ็นเตอร์ (MDB)', icon: <Activity size={20}/> },
                    { id: 'meter', label: 'มิเตอร์การไฟฟ้า', icon: <Zap size={20}/> }
                  ].map(photo => (
                    <button 
                      key={photo.id}
                      onClick={() => togglePhoto(photo.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all
                        ${photos[photo.id] ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
                    >
                      {photos[photo.id] ? <CheckCircle2 size={32} className="mb-2"/> : <Upload size={32} className="mb-2"/>}
                      <span className="font-semibold text-sm">{photo.label}</span>
                      <span className="text-xs mt-1">{photos[photo.id] ? 'Uploaded' : 'Tap to upload'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Physical Roof Data */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                    <HardHat className="text-amber-500" /> Roof & Physical Data
                  </h2>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-semibold">ทิศทางหลังคา (Azimuth)</label>
                        <select value={azimuth} onChange={(e) => setAzimuth(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none">
                          <option value="0">ทิศเหนือ (0°)</option>
                          <option value="90">ทิศตะวันออก (90°)</option>
                          <option value="180">ทิศใต้ (180°)</option>
                          <option value="270">ทิศตะวันตก (270°)</option>
                        </select>
                        {isBestAzimuth && <p className="text-xs text-emerald-400 mt-2 font-medium">Best Yield (แดดดีที่สุด)</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-semibold">มุมเอียง (Tilt Angle)</label>
                        <div className="relative">
                          <input type="number" value={tilt} onChange={(e) => setTilt(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                          <span className="absolute right-3 top-3 text-zinc-500">องศา</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">วัสดุมุงหลังคา (Roof Material)</label>
                      <select value={roofMat} onChange={(e) => setRoofMat(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none">
                        <option value="metal_sheet">เมทัลชีท (Metal Sheet)</option>
                        <option value="cpac">กระเบื้องซีแพค (CPAC Monier)</option>
                        <option value="corrugated">กระเบื้องลอนคู่</option>
                        <option value="concrete">ดาดฟ้าคอนกรีต (Slab)</option>
                      </select>
                      <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1"><Info size={14}/> มีผลต่อการเลือก Mounting Structure</p>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">การบังเงา (Shading Analysis)</label>
                      <select value={shading} onChange={(e) => setShading(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none">
                        <option value="none">ไม่มีเงาบังเลย (Clear)</option>
                        <option value="morning">มีเงาบังช่วงเช้า (Morning Shade)</option>
                        <option value="afternoon">มีเงาบังช่วงบ่าย (Afternoon Shade)</option>
                        <option value="severe">เงาบังเยอะมาก (แนะนำ Micro Inverter / Optimizer)</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">พื้นที่ติดตั้ง และ โครงสร้าง</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="พื้นที่ (ตร.ม.)" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none" />
                        <select value={buildYear} onChange={(e) => setBuildYear(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none">
                          <option value="after_2010">สร้างหลังปี 2010</option>
                          <option value="before_2010">สร้างก่อนปี 2010</option>
                        </select>
                      </div>
                      {showDeadLoadWarning && (
                        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg flex gap-2 text-amber-400 text-xs">
                          <AlertTriangle className="shrink-0" size={16}/>
                          <span>WARNING: อาคารเก่า แนะนำให้วิศวกรโยธาประเมินการเสริมโครงสร้าง (Dead Load)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Electrical Infrastructure */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                    <Activity className="text-purple-500" /> Existing Electrical Infra.
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">ขนาดมิเตอร์การไฟฟ้า</label>
                      <select value={meterSize} onChange={(e) => setMeterSize(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none">
                        <option value="1p_15_45">1-Phase 15(45)A (จำกัด 5 kW)</option>
                        <option value="1p_30_100">1-Phase 30(100)A (จำกัด 5 kW)</option>
                        <option value="3p_15_45">3-Phase 15(45)A (จำกัด 10 kW)</option>
                        <option value="3p_30_100">3-Phase 30(100)A (สูงสุด)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-semibold">Main Breaker เดิม (A)</label>
                        <input type="number" placeholder="เช่น 50" value={mainBreaker} onChange={(e) => setMainBreaker(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-semibold">Spare Slot ในตู้ MDB</label>
                        <select value={spareSlot} onChange={(e) => setSpareSlot(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none">
                          <option value="yes">มีช่องว่าง</option>
                          <option value="no">ไม่มี (ต้องติดตู้ Sub เพิ่ม)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">ระยะเดินสายไฟ (Inverter - MDB)</label>
                      <div className="relative">
                        <input type="number" placeholder="เช่น 20" value={cableDist} onChange={(e) => setCableDist(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                        <span className="absolute right-3 top-3 text-zinc-500">เมตร</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">ประเมินความยาวสาย AC/DC และ Voltage Drop เบื้องต้น</p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">ผลวัดค่า Grounding (Ω)</label>
                      <input type="number" placeholder="ป้อนค่าความต้านทาน (มาตรฐาน < 5 Ω)" value={grounding} onChange={(e) => setGrounding(e.target.value)} className={`w-full bg-zinc-950 border rounded-lg p-3 text-white focus:outline-none ${groundingFailed ? 'border-red-500' : 'border-zinc-700 focus:border-purple-500'}`} />
                      {groundingFailed && <p className="text-xs text-red-500 mt-2 font-bold">FAILED: ค่าความต้านทานเกิน 5 โอห์ม แนะนำตอกกราวด์รอตเพิ่ม</p>}
                    </div>
                  </div>
                </div>
              </div>
                
              <div className="mt-8 flex justify-end">
                <button onClick={() => setActiveTab('design')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">Next: System Design <ChevronRight size={16}/></button>
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-6">
                    {/* System Sizing */}
                    <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                      <label className="block text-sm text-zinc-400 mb-3 font-semibold">ค่าไฟเฉลี่ยรายเดือน (บาท) เพื่อประเมิน System Size</label>
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input type="number" value={monthlyBill || ''} onChange={(e) => setMonthlyBill(Number(e.target.value))} placeholder="เช่น 8000" className="w-full sm:w-1/2 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-lg focus:border-emerald-500 outline-none" />
                        <div className="w-full sm:w-1/2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center">
                          <span className="text-zinc-400 text-sm block">ขนาดระบบแนะนำเบื้องต้น</span>
                          <span className="text-2xl font-black text-emerald-400">{recommendedKw} kWp</span>
                        </div>
                      </div>
                    </div>

                    {/* Panel Selection */}
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">ชนิดแผง (Solar Module Type)</label>
                      <select value={panelType} onChange={(e) => setPanelType(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mb-3">
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
                  </div>

                  {/* Load Profile vs Solar Gen Graph */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                      <Activity size={16} className="text-blue-400"/> Load Profile vs Solar Gen (Simulation)
                    </h3>
                    <div className="flex-1 min-h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                          <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '14px' }}
                          />
                          <Area type="monotone" dataKey="load" name="Load (kWh)" stroke="#ef4444" fillOpacity={1} fill="url(#colorLoad)" />
                          <Area type="monotone" dataKey="solar" name="Solar Gen (kWh)" stroke="#10b981" fillOpacity={1} fill="url(#colorSolar)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1 text-zinc-400"><span className="w-3 h-3 rounded-full bg-red-500"></span> Load (การใช้ไฟ)</div>
                      <div className="flex items-center gap-1 text-zinc-400"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Solar (การผลิต)</div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-semibold">รูปแบบการเชื่อมต่อระบบ</label>
                      <select value={systemType} onChange={(e) => setSystemType(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none">
                        <option value="on_grid">On-Grid (คืนทุน 4-6 ปี, มี Net Billing)</option>
                        <option value="hybrid">Hybrid (รองรับแบตเตอรี่, คุ้มครองไฟตก)</option>
                        <option value="off_grid">Off-Grid (อิสระ 100%, ไม่เชื่อมการไฟฟ้า)</option>
                      </select>
                    </div>

                    <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                      <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2">Regulatory Checks</h3>
                      
                      {slowRoiWarning && (
                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-3 text-sm">
                          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                          <div className="text-red-400">
                            <strong className="block mb-1">WARNING: ROI ต่ำกว่าเกณฑ์ (ค่าไฟน้อย)</strong>
                            <p className="opacity-90">เนื่องจากนโยบายค่าไฟก้าวหน้า ลูกค้าที่ค่าไฟ &lt; 3,000 บาท จะมีระยะเวลาคืนทุนยาวนาน (อาจถึง 8-10 ปี)</p>
                          </div>
                        </div>
                      )}

                      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${hasETax ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}>
                        <input type="checkbox" checked={hasETax} onChange={(e) => setHasETax(e.target.checked)} className="w-5 h-5 rounded border-zinc-600 text-emerald-500 bg-zinc-950" />
                        <div>
                          <strong className={hasETax ? "text-emerald-400" : "text-zinc-300"}>สามารถออก e-Tax Invoice ได้</strong>
                          <p className="text-xs text-zinc-500 mt-1">สำหรับการใช้สิทธิลดหย่อนภาษี 200,000 บาท</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Safety Checklist */}
                    <div>
                      <label className="block text-sm text-zinc-400 mb-3 font-semibold">Safety Compliance Checklist</label>
                      <div className="space-y-2">
                        {[
                          { id: 'approved', label: 'Inverter อยู่ใน Approved List (PEA/MEA)' },
                          { id: 'afci', label: 'มีระบบป้องกัน DC Arc (AFCI)' },
                          { id: 'islanding', label: 'ระบบ Anti-islanding ทำงานปกติ' }
                        ].map(check => (
                          <label key={check.id} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors">
                            <input type="checkbox" checked={safetyChecks[check.id]} onChange={(e) => setSafetyChecks({...safetyChecks, [check.id]: e.target.checked})} className="w-4 h-4 rounded text-emerald-500 bg-zinc-900 border-zinc-600" />
                            <span className={`text-sm ${safetyChecks[check.id] ? "text-white" : "text-zinc-400"}`}>{check.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Document Checklist */}
                    <div>
                      <label className="block text-sm text-zinc-400 mb-3 font-semibold">Document Checklist (เอกสารยื่นขนานไฟ)</label>
                      <div className="space-y-2">
                        {[
                          { id: 'sld', label: 'แบบ Single Line Diagram (SLD)' },
                          { id: 'inverterTest', label: 'เอกสารผลทดสอบ Inverter (กฟน./กฟภ.)' }
                        ].map(doc => (
                          <label key={doc.id} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors">
                            <input type="checkbox" checked={docs[doc.id]} onChange={(e) => setDocs({...docs, [doc.id]: e.target.checked})} className="w-4 h-4 rounded text-blue-500 bg-zinc-900 border-zinc-600" />
                            <span className={`text-sm ${docs[doc.id] ? "text-white" : "text-zinc-400"}`}>{doc.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
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
              <div className="bg-zinc-100 border border-zinc-300 rounded-sm p-8 md:p-12 shadow-2xl text-zinc-900 max-w-4xl mx-auto">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Site Summary */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-zinc-300 pb-1"><HardHat size={18}/> Roof & Infra Conditions</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Azimuth / Tilt:</span>
                        <span className="font-semibold">{azimuth}° / {tilt}°</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Roof Area / Material:</span>
                        <span className="font-semibold">{roofArea || '0'} sq.m. / {roofMat}</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Shading Issue:</span>
                        <span className={`font-semibold ${shading !== 'none' ? 'text-amber-600' : 'text-emerald-600'}`}>{shading.toUpperCase()}</span>
                      </li>
                      <li className="flex justify-between border-b border-zinc-200 py-1">
                        <span className="text-zinc-600">Meter Size:</span>
                        <span className="font-semibold">{meterSize.replace('_', ' ').toUpperCase()}</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span className="text-zinc-600">Grounding Test:</span>
                        <span className={`font-bold ${groundingFailed ? 'text-red-600' : 'text-emerald-600'}`}>{grounding ? `${grounding} Ω` : 'N/A'} {groundingFailed && '(FAILED)'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* System Summary */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-zinc-300 pb-1"><Zap size={18}/> System Design & Compliance</h3>
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
                        <span className="text-zinc-600">Permit Required:</span>
                        <span className="font-semibold text-amber-600">{needA1Form ? 'อ.1 (ดัดแปลงอาคาร)' : 'อ.6 (แจ้งยกเว้น)'}</span>
                      </li>
                    </ul>
                    
                    <div className="mt-4 bg-zinc-200/50 border border-zinc-300 p-3 rounded">
                      <p className="text-xs font-bold text-zinc-500 mb-2 uppercase">Safety & Doc Compliance</p>
                      <div className="flex flex-col gap-1 text-xs font-medium">
                        <span className={safetyChecks.approved && safetyChecks.afci && safetyChecks.islanding ? 'text-emerald-600' : 'text-red-500'}>Safety: {safetyChecks.approved && safetyChecks.afci && safetyChecks.islanding ? 'All Passed' : 'Missing Checks'}</span>
                        <span className={docs.sld && docs.inverterTest ? 'text-emerald-600' : 'text-red-500'}>Documents: {docs.sld && docs.inverterTest ? 'Ready' : 'Incomplete'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-xs text-zinc-500 border-t border-zinc-300 pt-6">
                  <p>Generated by Pro Solar Estimator App (v4.0.0)</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
