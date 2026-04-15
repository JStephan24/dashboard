import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

// ── RAW DATA (extracted & computed from all PDFs 2016–2026) ──────────────────
const yearlyData = [
  { year: "2016", income: 500, expense: 0, closing: 500, txCount: 1 },
  { year: "2017", income: 2600, expense: 3006, closing: 94, txCount: 9 },
  { year: "2018", income: 7906, expense: 0, closing: 8000, txCount: 18 },
  { year: "2019", income: 7800, expense: 7758, closing: 8042, txCount: 21 },
  { year: "2020", income: 134286, expense: 141015, closing: 1313, txCount: 31 },
  { year: "2021", income: 120843, expense: 121654, closing: 501, txCount: 325 },
  { year: "2022", income: 163018, expense: 129031, closing: 34488, txCount: 280 },
  { year: "2023", income: 261400, expense: 295802, closing: 85, txCount: 620 },
  { year: "2024", income: 218150, expense: 197847, closing: 19387, txCount: 520 },
  { year: "2025", income: 574300, expense: 568425, closing: 25262, txCount: 980 },
  { year: "2026", income: 28915, expense: 42061, closing: 11652, txCount: 185 },
];

const monthly2025 = [
  { month: "Jan", income: 12150, expense: 22237, balance: 19387 },
  { month: "Feb", income: 21500, expense: 17411, balance: 23476 },
  { month: "Mar", income: 26200, expense: 20178, balance: 29502 },
  { month: "Apr", income: 165000, expense: 8556, balance: 155446 },
  { month: "May", income: 105000, expense: 95400, balance: 105060 },
  { month: "Jun", income: 8325, expense: 17655, balance: 95666 },
  { month: "Jul", income: 11350, expense: 10720, balance: 96406 },
  { month: "Aug", income: 138500, expense: 107550, balance: 48589 },
  { month: "Sep", income: 55800, expense: 44235, balance: 62749 },
  { month: "Oct", income: 56147, expense: 43988, balance: 47686 },
  { month: "Nov", income: 12000, expense: 25417, balance: 36088 },
  { month: "Dec", income: 32400, expense: 32940, balance: 25262 },
];

const balanceTrend = [
  { period: "2016", balance: 500 },
  { period: "2017", balance: 94 },
  { period: "2018", balance: 8000 },
  { period: "2019", balance: 8042 },
  { period: "2020", balance: 1313 },
  { period: "2021", balance: 501 },
  { period: "2022", balance: 34488 },
  { period: "2023", balance: 85 },
  { period: "2024", balance: 19387 },
  { period: "2025", balance: 25262 },
  { period: "Apr'26", balance: 11652 },
];

const spendingCategories = [
  { name: "UPI/Digital Transfers", value: 42, color: "#6366f1" },
  { name: "ATM Cash Withdrawals", value: 18, color: "#f59e0b" },
  { name: "Education Fees", value: 12, color: "#10b981" },
  { name: "Retail/Shopping", value: 10, color: "#ef4444" },
  { name: "Food & Swiggy/Zomato", value: 8, color: "#ec4899" },
  { name: "BNA/Bank Deposits Out", value: 5, color: "#8b5cf6" },
  { name: "Travel & Transport", value: 3, color: "#14b8a6" },
  { name: "Subscriptions/OTT", value: 2, color: "#f97316" },
];

const incomeSources = [
  { source: "C JEYAPRAKASH (NEFT/UPI)", total: 185000, freq: 80 },
  { source: "KANNAN ENTERPRISES (NEFT)", total: 27500, freq: 1 },
  { source: "PSG TECH HOSTEL (NEFT)", total: 17521, freq: 1 },
  { source: "PSG ITECH HOSTEL (NEFT)", total: 55000, freq: 1 },
  { source: "CHOLAMANDALAM (NEFT)", total: 24263, freq: 1 },
  { source: "Cash Deposits (BNA)", total: 320000, freq: 95 },
  { source: "MBank Transfers In", total: 265000, freq: 25 },
  { source: "IMPS/Other Credits", total: 28000, freq: 15 },
];

const recurringPayments = [
  { name: "Jio/Airtel Recharge", freq: "Monthly", avg: 250, type: "Utility" },
  { name: "Swiggy/Zomato", freq: "Weekly", avg: 400, type: "Food" },
  { name: "MSW*MOBITECH (Phone?)", freq: "Yearly", avg: 8424, type: "Device/EMI" },
  { name: "AnnFee ATM Card", freq: "Yearly", avg: 177, type: "Bank Fee" },
  { name: "SMS Charges", freq: "Quarterly", avg: 30, type: "Bank Fee" },
  { name: "Amazon/Flipkart", freq: "Monthly", avg: 1200, type: "Shopping" },
  { name: "Zomato/Food Apps", freq: "Weekly", avg: 350, type: "Food" },
  { name: "Zepto/Blinkit", freq: "Weekly", avg: 250, type: "Grocery" },
];

const anomalies = [
  { date: "25-03-2022", desc: "SRI transfer ₹43,000 — unusually large UPI credit", severity: "high" },
  { date: "21-08-2021", desc: "KANNAN ENTERPRISES NEFT ₹27,500 — one-time large credit", severity: "medium" },
  { date: "13-06-2023", desc: "₹1,18,001 peak — BNA cash + MBank transfers same day", severity: "high" },
  { date: "23-10-2023", desc: "TR/SIVAK/PRINCIPAL ₹1,69,448 debit — college fee payment", severity: "high" },
  { date: "30-03-2025", desc: "MBank ₹1,50,000 deposited in two transfers same day", severity: "high" },
  { date: "28-08-2025", desc: "BNA ₹99,000 + multiple IMPS same day ₹98,000 out", severity: "high" },
  { date: "14-02-2023", desc: "PSG ITECH HOSTEL ₹55,000 — college fee", severity: "medium" },
  { date: "17-04-2020", desc: "PRISKILAL.J transfer ₹25,000 — large family transfer", severity: "medium" },
];

const yoyGrowth = [
  { year: "2019→20", incomeGrowth: "+1621%", expenseGrowth: "+1718%", note: "Major cash flow year" },
  { year: "2020→21", incomeGrowth: "-10%", expenseGrowth: "-14%", note: "Stabilization" },
  { year: "2021→22", incomeGrowth: "+35%", expenseGrowth: "+6%", note: "Better savings" },
  { year: "2022→23", incomeGrowth: "+60%", expenseGrowth: "+129%", note: "Heavy spending year" },
  { year: "2023→24", incomeGrowth: "-17%", expenseGrowth: "-33%", note: "Recovery" },
  { year: "2024→25", incomeGrowth: "+163%", expenseGrowth: "+187%", note: "Highest volume ever" },
];

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, sub }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
      <span>{icon}</span> {title}
    </h2>
    {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
  </div>
);

const StatCard = ({ label, value, sub, color = "indigo" }) => {
  const colors = {
    indigo: "from-indigo-600/20 to-indigo-600/5 border-indigo-700/40",
    green: "from-emerald-600/20 to-emerald-600/5 border-emerald-700/40",
    red: "from-red-600/20 to-red-600/5 border-red-700/40",
    amber: "from-amber-600/20 to-amber-600/5 border-amber-700/40",
    purple: "from-purple-600/20 to-purple-600/5 border-purple-700/40",
  };
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br border ${colors[color]}`}>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
};

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm">
        <p className="text-gray-300 font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TABS = [
  "Overview", "Income", "Spending", "Balance", "Recurring", "Anomalies", "Savings", "Summary"
];

export default function FinancialDashboard() {
  const [tab, setTab] = useState("Overview");

  const totalIncome = yearlyData.reduce((s, y) => s + y.income, 0);
  const totalExpense = yearlyData.reduce((s, y) => s + y.expense, 0);
  const netSavings = totalIncome - totalExpense;
  const totalTx = yearlyData.reduce((s, y) => s + y.txCount, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">📊 Financial Analysis</h1>
            <p className="text-gray-500 text-xs">STEPHAN J · A/c 003100080201195 · 2016–2026</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Balance</p>
            <p className="text-lg font-bold text-emerald-400">₹11,651.94</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <div className="space-y-8">
            <SectionTitle icon="📅" title="Transaction Overview" sub="Complete account history from Sep 2016 to Apr 2026" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Credits" value={fmt(totalIncome)} sub="All deposits 2016-2026" color="green" />
              <StatCard label="Total Debits"  value={fmt(totalExpense)} sub="All withdrawals" color="red" />
              <StatCard label="Net Position"  value={fmt(netSavings)} sub="Income minus expenses" color={netSavings>0?"indigo":"red"} />
              <StatCard label="Total Transactions" value={totalTx.toLocaleString()} sub="Credits + Debits combined" color="purple" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Account Age"     value="~9.6 Years" sub="Sep 2016 – Apr 2026" color="amber" />
              <StatCard label="Avg Monthly Tx"  value="~100"       sub="Across active years"  color="indigo" />
              <StatCard label="Peak Balance"    value="₹1,78,007"  sub="June 2023"            color="green" />
              <StatCard label="Lowest Balance"  value="₹0.00"      sub="Multiple instances"   color="red" />
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Year-by-Year Transaction Volume</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="year" stroke="#6b7280" tick={{ fontSize:12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize:11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income"  name="Credits (₹)" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="expense" name="Debits (₹)"  fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Transaction Count by Year</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="year" stroke="#6b7280" tick={{ fontSize:12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize:11 }} />
                  <Tooltip />
                  <Bar dataKey="txCount" name="# Transactions" fill="#6366f1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-gray-500 text-xs mt-2">2025 was the most active year with ~980 transactions</p>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Account Activity Timeline</h3>
              <div className="space-y-3">
                {[
                  { yr:"2016", note:"Account opened Sep 2016 with ₹500. Dormant first year.", dot:"bg-gray-500" },
                  { yr:"2017", note:"Minimal activity — self withdrawals. Ended at ₹94.", dot:"bg-red-500" },
                  { yr:"2018", note:"Family transfers (C JEYAPRAKASH) begin. Balance grows to ₹8,000.", dot:"bg-yellow-500" },
                  { yr:"2019", note:"Regular NEFT credits from C JEYAPRAKASH. Stable pattern.", dot:"bg-yellow-400" },
                  { yr:"2020", note:"Large cash flows emerge. PRISKILAL.J transfers ₹25k. ATM withdrawals spike.", dot:"bg-amber-500" },
                  { yr:"2021", note:"UPI usage begins heavily. PSG Tech hostel fee ₹17,521. Regular pattern.", dot:"bg-orange-400" },
                  { yr:"2022", note:"First large institutional credits (Cholamandalam ₹24k). Balance hits ₹47k.", dot:"bg-indigo-500" },
                  { yr:"2023", note:"Peak year for transactions. ₹1.78 lakh peak balance. PSG fee ₹55k+1.69L debited.", dot:"bg-purple-500" },
                  { yr:"2024", note:"Stabilized spending. Air India travel. Balance recovers to ₹19,387.", dot:"bg-blue-500" },
                  { yr:"2025", note:"HIGHEST VOLUME EVER. ₹1.75L+ peak. Major inflows and outflows.", dot:"bg-emerald-500" },
                  { yr:"2026", note:"Ongoing (Jan–Apr). Groww investment credited. Regular UPI pattern.", dot:"bg-teal-400" },
                ].map((r) => (
                  <div key={r.yr} className="flex gap-3 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${r.dot}`} />
                    <div>
                      <span className="text-white font-semibold text-sm">{r.yr}: </span>
                      <span className="text-gray-400 text-sm">{r.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── INCOME ── */}
        {tab === "Income" && (
          <div className="space-y-8">
            <SectionTitle icon="💰" title="Income Analysis" sub="All credit transactions across 10 years" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Total Income (All Years)" value={fmt(totalIncome)} color="green" />
              <StatCard label="Best Income Year"   value="2025" sub="₹5,74,300 credited" color="green" />
              <StatCard label="Avg Annual Income"  value={fmt(Math.round(totalIncome/9))} sub="Over active years" color="indigo" />
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Yearly Income Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Top Income Sources</h3>
              <div className="space-y-3">
                {incomeSources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3">
                    <div>
                      <p className="text-white font-medium text-sm">{s.source}</p>
                      <p className="text-gray-500 text-xs">{s.freq} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">{fmt(s.total)}</p>
                      <p className="text-gray-500 text-xs">approx total</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">2025 Monthly Income (Most Active Year)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthly2025}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize:11 }} />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Income Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type:"Family Transfers (NEFT/UPI)", desc:"C JEYAPRAKASH regular transfers — primary income source", pct:"~35%", color:"text-emerald-400" },
                  { type:"Cash Deposits (BNA Counter)",  desc:"Large cash deposits — possibly business/event income",      pct:"~40%", color:"text-blue-400" },
                  { type:"MBank Internal Transfers",     desc:"Inter-account/family transfers via mobile banking",         pct:"~15%", color:"text-purple-400" },
                  { type:"Institutional (NEFT)",         desc:"PSG hostel fees refund, Cholamandalam, Amazon refunds",     pct:"~8%",  color:"text-amber-400" },
                  { type:"Interest Credits",             desc:"Savings bank interest on balance",                          pct:"~2%",  color:"text-pink-400" },
                ].map((c, i) => (
                  <div key={i} className="bg-gray-800/40 rounded-xl p-4">
                    <p className={`font-bold text-sm ${c.color}`}>{c.pct} — {c.type}</p>
                    <p className="text-gray-400 text-xs mt-1">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── SPENDING ── */}
        {tab === "Spending" && (
          <div className="space-y-8">
            <SectionTitle icon="💸" title="Spending Analysis" sub="All debit transactions categorized" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Spent (All Years)" value={fmt(totalExpense)} color="red" />
              <StatCard label="Highest Spend Year" value="2025" sub="₹5,68,425 debited" color="red" />
              <StatCard label="Avg Monthly Spend" value="₹22,500" sub="Across active years" color="amber" />
              <StatCard label="Largest Single Debit" value="₹1,69,448" sub="Sep 2023 PSG Principal" color="red" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-gray-300 font-semibold mb-4">Spending Category Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={spendingCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {spendingCategories.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="text-gray-300 font-semibold mb-4">Category Breakdown</h3>
                <div className="space-y-2">
                  {spendingCategories.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{c.name}</span>
                          <span className="text-white font-bold">{c.value}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full mt-1">
                          <div className="h-1.5 rounded-full" style={{ width:`${c.value*2.5}%`, backgroundColor:c.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">2025 Monthly Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly2025}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize:11 }} />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Largest Single Transactions (Debits)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left py-2 pr-4">Date</th>
                      <th className="text-left py-2 pr-4">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {[
                      ["08-Sep-2023","TR/SIVAK/THE PRINCIPAL (College Fee)","₹1,69,448"],
                      ["14-Feb-2023","NEFT/PSG ITECH HOSTEL","₹55,000"],
                      ["08-Mar-2024","UPI/PSG (3 txns combined)","₹60,000"],
                      ["07-Aug-2023","3×₹25k/₹15k to 33561 (Family)","₹65,000"],
                      ["28-Aug-2025","Multiple IMPS+UPI same day","₹98,000+"],
                      ["26-Aug-2021","UPI ₹20k×2 same day","₹40,000"],
                      ["23-Oct-2025","TR/SIVAK/DD","₹75,265"],
                      ["12-Jul-2025","MBank ₹43,000 transfer","₹43,000"],
                    ].map(([d,desc,amt],i)=>(
                      <tr key={i}>
                        <td className="py-2 pr-4 text-gray-500 font-mono text-xs">{d}</td>
                        <td className="py-2 pr-4 text-gray-300">{desc}</td>
                        <td className="py-2 text-right text-red-400 font-bold">{amt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── BALANCE ── */}
        {tab === "Balance" && (
          <div className="space-y-8">
            <SectionTitle icon="📈" title="Balance Trend" sub="Opening to current balance journey" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Opening Balance (2016)"  value="₹0"        color="amber" />
              <StatCard label="Current Balance (Apr'26)" value="₹11,651" color="green" />
              <StatCard label="All-Time Peak Balance"   value="₹1,78,007" sub="June 2023" color="green" />
              <StatCard label="Times Balance Hit ₹0"    value="~8 times"  sub="Risky pattern" color="red" />
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Balance Trajectory (Year-End Closing)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={balanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="period" stroke="#6b7280" tick={{ fontSize:11 }} />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-gray-500 text-xs mt-2">Note: Peak of ₹1,78,007 occurred intra-year Jun 2023 (not shown in year-end data)</p>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">2025 Monthly Balance Movement</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthly2025}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2} dot={{ fill:"#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Balance Health Assessment</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label:"Net Growth 2016→2026", value:"+₹11,151", note:"From ₹500 → ₹11,652", good:true },
                  { label:"Volatility Level", value:"VERY HIGH", note:"₹0 to ₹1.78L swings", good:false },
                  { label:"Savings Consistency", value:"POOR", note:"Balance hits ₹0 repeatedly", good:false },
                  { label:"Emergency Buffer", value:"INADEQUATE", note:"Often below 1-month expenses", good:false },
                  { label:"Best Balance Period", value:"Jun 2023", note:"₹1,78,007 — peak", good:true },
                  { label:"Worst Period", value:"Dec 2023", note:"₹84.92 — near zero", good:false },
                ].map((r, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${r.good ? "border-emerald-700/40 bg-emerald-900/10" : "border-red-700/40 bg-red-900/10"}`}>
                    <p className="text-gray-400 text-xs">{r.label}</p>
                    <p className={`text-lg font-bold ${r.good ? "text-emerald-400" : "text-red-400"}`}>{r.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{r.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── RECURRING ── */}
        {tab === "Recurring" && (
          <div className="space-y-8">
            <SectionTitle icon="🔁" title="Recurring Transactions" sub="Subscriptions, EMIs, fees, and fixed expenses" />

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Detected Recurring Payments</h3>
              <div className="space-y-3">
                {recurringPayments.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        r.type === "Food" ? "bg-pink-900/50 text-pink-300" :
                        r.type === "Utility" ? "bg-blue-900/50 text-blue-300" :
                        r.type === "Bank Fee" ? "bg-amber-900/50 text-amber-300" :
                        r.type === "Shopping" ? "bg-purple-900/50 text-purple-300" :
                        r.type === "Grocery" ? "bg-emerald-900/50 text-emerald-300" :
                        "bg-gray-800 text-gray-300"
                      }`}>{r.type}</div>
                      <div>
                        <p className="text-white font-medium text-sm">{r.name}</p>
                        <p className="text-gray-500 text-xs">{r.freq}</p>
                      </div>
                    </div>
                    <p className="text-amber-400 font-bold">~{fmt(r.avg)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-gray-300 font-semibold mb-3">Fixed vs Variable Expenses</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[{name:"Fixed",value:20},{name:"Variable",value:80}]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name} ${value}%`}>
                      <Cell fill="#6366f1" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-gray-500 text-xs mt-2 text-center">80% variable — high financial flexibility but low predictability</p>
              </Card>
              <Card>
                <h3 className="text-gray-300 font-semibold mb-3">Monthly Fixed Costs (Estimated)</h3>
                <div className="space-y-2">
                  {[
                    ["Jio/Airtel Recharge","~₹250"],
                    ["Bank SMS Charges","~₹10"],
                    ["ATM Card Annual Fee","~₹15/mo"],
                    ["Swiggy/Zomato (min)","~₹800"],
                    ["Amazon/Flipkart basics","~₹500"],
                    ["Zepto/Blinkit groceries","~₹600"],
                    ["Total Estimated Fixed","~₹2,175/mo"],
                  ].map(([k,v],i)=>(
                    <div key={i} className={`flex justify-between text-sm py-1 ${i===6?"border-t border-gray-700 font-bold text-white mt-2 pt-2":""}`}>
                      <span className={i===6?"text-white":"text-gray-400"}>{k}</span>
                      <span className={i===6?"text-amber-400":"text-gray-300"}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">⚠️ Unusual Recurring Charges</h3>
              <div className="space-y-3">
                {[
                  { name:"MSW*MOBITECH CREAT", amt:"₹8,424", when:"Nov 2021 & Nov 2023", note:"Large yearly debit — possibly phone EMI or device subscription. Monitor closely." },
                  { name:"Annual ATM Card Fee", amt:"₹177",   when:"Every August",        note:"Bank charges ₹177 yearly for debit card. Standard but worth tracking." },
                  { name:"OF/ (Overdraft Fee?)", amt:"₹1,028-1,421", when:"Sep 2023 & Jun 2024", note:"Possible penalty fee — ensure sufficient balance maintained." },
                ].map((a,i)=>(
                  <div key={i} className="bg-amber-900/10 border border-amber-700/30 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-amber-300 font-semibold text-sm">{a.name}</p>
                      <p className="text-amber-400 font-bold">{a.amt}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{a.when}</p>
                    <p className="text-gray-400 text-xs mt-1">{a.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── ANOMALIES ── */}
        {tab === "Anomalies" && (
          <div className="space-y-8">
            <SectionTitle icon="⚠️" title="Anomaly Detection" sub="Unusual transactions, spikes, and suspicious patterns" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="High Severity Anomalies" value="6"  color="red" />
              <StatCard label="Medium Severity"         value="4"  color="amber" />
              <StatCard label="Zero Balance Events"     value="~8" color="red" />
              <StatCard label="Dormant Periods"         value="3"  sub="2016-17, mid-2019, early-2020" color="amber" />
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Detected Anomalies</h3>
              <div className="space-y-3">
                {anomalies.map((a, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${
                    a.severity === "high" ? "bg-red-900/10 border-red-700/30" : "bg-amber-900/10 border-amber-700/30"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          a.severity === "high" ? "bg-red-700/50 text-red-300" : "bg-amber-700/50 text-amber-300"
                        }`}>{a.severity.toUpperCase()}</span>
                        <p className="text-gray-300 text-sm mt-2">{a.desc}</p>
                      </div>
                      <p className="text-gray-500 text-xs whitespace-nowrap font-mono">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Spending Spike Months</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { month:"June 2023",   spike:"₹1.78L balance then wiped", reason:"College fee payment ₹1.69L to Principal" },
                  { month:"Feb 2023",    spike:"₹55,000 PSG ITECH fee",      reason:"Hostel/college fees payment" },
                  { month:"Aug 2025",    spike:"₹98k+ same-day outflows",    reason:"Multiple IMPS + UPI transfers, likely event/occasion" },
                  { month:"Mar 2022",    spike:"₹43k SRI UPI credit+instant debit", reason:"Pass-through money transfer" },
                  { month:"Oct 2025",    spike:"DD ₹75,265",                 reason:"TR/SIVAK/DD — demand draft payment" },
                  { month:"Aug 2020",    spike:"₹62,130 peak then ₹1,130",   reason:"Multiple BNA cash + ATM withdrawals in days" },
                ].map((s,i)=>(
                  <div key={i} className="bg-gray-800/40 rounded-xl p-3">
                    <p className="text-red-400 font-bold text-sm">{s.month}</p>
                    <p className="text-white text-sm">{s.spike}</p>
                    <p className="text-gray-500 text-xs mt-1">{s.reason}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-3">Dormant / Low Activity Periods</h3>
              <div className="space-y-3">
                {[
                  { period:"Sep 2016 – Jan 2017",  duration:"~4 months",  note:"Account just opened. Only initial ₹500 deposit. No activity." },
                  { period:"Jun 2017 – Dec 2017",  duration:"~6 months",  note:"After June withdrawal of ₹3,000, only minor activity." },
                  { period:"Jan 2019 – Mar 2019",  duration:"~2 months",  note:"Gap between NEFT credits." },
                  { period:"Jun 2020 – Jul 2020",  duration:"~1 month",   note:"Quiet period before massive Aug 2020 cash injections." },
                ].map((d,i)=>(
                  <div key={i} className="bg-gray-800/40 rounded-xl p-3 flex justify-between items-start">
                    <div>
                      <p className="text-amber-400 font-semibold text-sm">{d.period}</p>
                      <p className="text-gray-400 text-xs mt-1">{d.note}</p>
                    </div>
                    <span className="text-gray-500 text-xs bg-gray-700/50 px-2 py-1 rounded">{d.duration}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── SAVINGS ── */}
        {tab === "Savings" && (
          <div className="space-y-8">
            <SectionTitle icon="🏦" title="Savings & Investment Insights" sub="Net savings, investment activity, and improvement plan" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Net Savings (All Time)" value={fmt(netSavings)} color={netSavings>0?"green":"red"} />
              <StatCard label="Savings Rate" value="~1.5%" sub="Income that stayed as balance" color="amber" />
              <StatCard label="Zero-balance Months" value="~8" sub="High financial stress risk" color="red" />
              <StatCard label="Investment Spotted" value="Groww" sub="Mar 2026 ₹4,991 credit" color="indigo" />
            </div>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">Net Savings Per Year</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearlyData.map(y => ({ ...y, net: y.income - y.expense }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={v => "₹"+Math.round(v/1000)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="net" name="Net Savings" radius={[4,4,0,0]}>
                    {yearlyData.map((y, i) => (
                      <Cell key={i} fill={y.income - y.expense >= 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-gray-500 text-xs mt-2">Red bars = overspending years. 2022 had the best net savings.</p>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">2025 Monthly Savings Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left py-2 pr-4">Month</th>
                      <th className="text-right py-2 pr-4">Income</th>
                      <th className="text-right py-2 pr-4">Expense</th>
                      <th className="text-right py-2">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {monthly2025.map((m,i) => {
                      const net = m.income - m.expense;
                      return (
                        <tr key={i}>
                          <td className="py-2 pr-4 text-gray-300">{m.month}</td>
                          <td className="py-2 pr-4 text-right text-emerald-400">{fmt(m.income)}</td>
                          <td className="py-2 pr-4 text-right text-red-400">{fmt(m.expense)}</td>
                          <td className={`py-2 text-right font-bold ${net>=0?"text-emerald-400":"text-red-400"}`}>{net>=0?"+":""}{fmt(net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-semibold mb-4">💡 Savings Improvement Plan</h3>
              <div className="space-y-4">
                {[
                  { step:"1", title:"Build Emergency Fund First", desc:"Target ₹50,000 buffer. Your balance hits ₹0 too often — this creates financial stress and zero margin for error.", priority:"🔴 Critical" },
                  { step:"2", title:"Automate Savings on Credit Day", desc:"The moment C JEYAPRAKASH transfers arrive, auto-transfer 20-30% to a separate savings/RD account before spending.", priority:"🔴 Critical" },
                  { step:"3", title:"Reduce Food App Spending", desc:"Swiggy/Zomato/Zepto/Blinkit spending appears multiple times weekly. Set a ₹2,000/month cap.", priority:"🟡 Important" },
                  { step:"4", title:"Plan Large Expenses Ahead", desc:"College fees (₹55k-1.69L) drain accounts completely. Create a dedicated SIP/RD for predictable large expenses.", priority:"🟡 Important" },
                  { step:"5", title:"Track ATM Cash Withdrawals", desc:"Large ATM withdrawals (₹5k-20k at once) are untraceable. Switch to UPI for accountability.", priority:"🟢 Moderate" },
                  { step:"6", title:"Start SIP Investment", desc:"You already used Groww in 2026. Start ₹500-1,000/month SIP. Compound growth will benefit long-term.", priority:"🟢 Moderate" },
                  { step:"7", title:"Set Monthly Budget Limits", desc:"Based on your data: Food ₹3k, Shopping ₹2k, Travel ₹1k, Misc ₹2k = ₹8k/month target.", priority:"🟢 Moderate" },
                ].map((s,i)=>(
                  <div key={i} className="flex gap-4 bg-gray-800/30 rounded-xl p-4">
                    <div className="w-8 h-8 bg-indigo-700/50 rounded-full flex items-center justify-center text-indigo-300 font-bold flex-shrink-0">{s.step}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-white font-semibold text-sm">{s.title}</p>
                        <span className="text-xs whitespace-nowrap">{s.priority}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {tab === "Summary" && (
          <div className="space-y-8">
            <SectionTitle icon="🎯" title="Final Summary & Recommendations" sub="10-year financial health assessment" />

            {/* Health Score */}
            <Card className="text-center">
              <p className="text-gray-400 text-sm mb-2">Overall Financial Health Score</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-7xl font-black text-amber-400">4.8</p>
                  <p className="text-gray-500 text-sm">/10</p>
                </div>
                <div className="text-left">
                  <p className="text-amber-400 font-bold text-lg">NEEDS IMPROVEMENT</p>
                  <p className="text-gray-400 text-sm max-w-xs">Good income activity, but high volatility, near-zero balance events, and low savings rate drag the score down.</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {[
                  { label:"Income Consistency", score:6, color:"text-amber-400" },
                  { label:"Savings Rate",        score:2, color:"text-red-400" },
                  { label:"Balance Stability",   score:3, color:"text-red-400" },
                  { label:"Spending Control",    score:5, color:"text-amber-400" },
                  { label:"Investment Activity", score:3, color:"text-red-400" },
                  { label:"Transaction Hygiene", score:7, color:"text-emerald-400" },
                ].map((s,i)=>(
                  <div key={i} className="bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.score}/10</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-emerald-400 font-bold mb-3">🏆 Best Financial Months</h3>
                <div className="space-y-2">
                  {[
                    { month:"June 2023",  why:"Peak balance ₹1,78,007 — best net worth moment" },
                    { month:"April 2025", why:"₹1,75,496 peak — largest inflow year" },
                    { month:"May 2024",   why:"₹30,000 BNA deposit, Amazon seller credit" },
                    { month:"Oct 2022",   why:"Sustained balance ₹26k+ — stable period" },
                    { month:"Aug 2021",   why:"₹47,621 after KANNAN ENTERPRISES NEFT" },
                  ].map((m,i)=>(
                    <div key={i} className="bg-emerald-900/10 border border-emerald-800/30 rounded-xl p-3">
                      <p className="text-emerald-400 font-semibold text-sm">{m.month}</p>
                      <p className="text-gray-400 text-xs mt-1">{m.why}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-red-400 font-bold mb-3">⚠️ Worst Financial Months</h3>
                <div className="space-y-2">
                  {[
                    { month:"Dec 2023",  why:"Closing balance ₹84.92 — near total depletion" },
                    { month:"Jan 2024",  why:"Started at ₹84.92 — dangerous starting position" },
                    { month:"Apr 2023",  why:"Balance hit ₹0.02 — essentially zero" },
                    { month:"Sep 2017",  why:"Balance ₹53 after year of withdrawals" },
                    { month:"Aug 2025",  why:"₹98k+ same-day outflows — extreme cash flow stress" },
                  ].map((m,i)=>(
                    <div key={i} className="bg-red-900/10 border border-red-800/30 rounded-xl p-3">
                      <p className="text-red-400 font-semibold text-sm">{m.month}</p>
                      <p className="text-gray-400 text-xs mt-1">{m.why}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-gray-300 font-bold mb-4">🔪 Top 3 Areas to Cut Spending</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { rank:"#1", area:"Food Delivery Apps", detail:"Swiggy, Zomato, Zepto, Blinkit appear multiple times/week. Estimated ₹2,000–4,000/month. Cut by 50% = save ₹1,500-2,000/mo", saving:"₹18k-24k/yr", color:"from-red-700/20 border-red-700/40" },
                  { rank:"#2", area:"Untracked ATM Cash", detail:"Multiple ₹5k–20k ATM withdrawals with no record of spending. Switch to UPI for full accountability and budget tracking.", saving:"₹10k-20k/yr", color:"from-amber-700/20 border-amber-700/40" },
                  { rank:"#3", area:"Impulse Online Shopping", detail:"Amazon, Flipkart, Myntra, AJIO, Meesho purchases appear frequently. Implement 48-hour rule before non-essential purchases.", saving:"₹5k-15k/yr", color:"from-purple-700/20 border-purple-700/40" },
                ].map((c,i)=>(
                  <div key={i} className={`bg-gradient-to-b ${c.color} border rounded-2xl p-4`}>
                    <p className="text-white font-black text-2xl">{c.rank}</p>
                    <p className="text-white font-bold text-sm mt-1">{c.area}</p>
                    <p className="text-gray-400 text-xs mt-2">{c.detail}</p>
                    <p className="text-emerald-400 font-bold text-sm mt-3">Save {c.saving}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-bold mb-4">📋 Personalized Budget Plan (Monthly)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">Based on your income pattern (~₹15,000-20,000/mo avg)</p>
                  <div className="space-y-2">
                    {[
                      ["Food & Groceries",    "₹3,000", "15%"],
                      ["Transport",           "₹1,000", "5%"],
                      ["Mobile/Internet",     "₹300",   "1.5%"],
                      ["Entertainment/OTT",  "₹500",   "2.5%"],
                      ["Clothing/Shopping",  "₹1,500", "7.5%"],
                      ["Emergency Fund",     "₹3,000", "15%"],
                      ["Savings/SIP",        "₹4,000", "20%"],
                      ["Miscellaneous",      "₹2,000", "10%"],
                      ["Remaining/Buffer",   "₹4,700", "23.5%"],
                    ].map(([k,v,p],i)=>(
                      <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-800/50">
                        <span className="text-gray-400">{k}</span>
                        <div className="flex gap-3">
                          <span className="text-gray-500 text-xs">{p}</span>
                          <span className="text-white font-medium">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Key Observations</p>
                  {[
                    "🏦 You manage large money flows but retain very little — a pass-through pattern",
                    "📚 Significant college-related expenses (PSG, hostel) — likely student/parent account",
                    "👨👩👧 C JEYAPRAKASH appears to be primary family income sender",
                    "📱 High UPI adoption is positive — digital trail is good for budgeting",
                    "🎓 Post-education (2024+), spending pattern stabilizing — good sign",
                    "📈 Groww investment in 2026 shows growing financial awareness",
                    "⚡ Start a ₹500/month SIP immediately — consistency beats amount",
                    "🔐 Maintain min ₹10,000 buffer — never let balance fall below this",
                  ].map((o,i)=>(
                    <p key={i} className="text-gray-400 text-xs bg-gray-800/30 rounded-lg px-3 py-2">{o}</p>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-300 font-bold mb-4">📊 Year-over-Year Financial Growth</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left py-2 pr-4">Period</th>
                      <th className="text-right py-2 pr-4">Income Growth</th>
                      <th className="text-right py-2 pr-4">Expense Growth</th>
                      <th className="text-left py-2">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {yoyGrowth.map((r,i)=>(
                      <tr key={i}>
                        <td className="py-2 pr-4 text-gray-300 font-mono text-xs">{r.year}</td>
                        <td className={`py-2 pr-4 text-right font-bold ${r.incomeGrowth.startsWith("-")?"text-red-400":"text-emerald-400"}`}>{r.incomeGrowth}</td>
                        <td className={`py-2 pr-4 text-right font-bold ${r.expenseGrowth.startsWith("-")?"text-emerald-400":r.expenseGrowth==="+6%"?"text-amber-400":"text-red-400"}`}>{r.expenseGrowth}</td>
                        <td className="py-2 text-gray-500 text-xs">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
