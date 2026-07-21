import { motion } from 'motion/react';
import { Users, ShoppingCart, DollarSign, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 139 },
  { name: 'Wed', revenue: 2000, orders: 980 },
  { name: 'Thu', revenue: 2780, orders: 390 },
  { name: 'Fri', revenue: 1890, orders: 480 },
  { name: 'Sat', revenue: 2390, orders: 380 },
  { name: 'Sun', revenue: 3490, orders: 430 },
];

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$24,592.50', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-blue-500' },
    { title: 'Active Users', value: '1,432', change: '+5.2%', trend: 'up', icon: Users, color: 'text-blue-500' },
    { title: 'Total Orders', value: '45,231', change: '+22.4%', trend: 'up', icon: ShoppingCart, color: 'text-purple-500' },
    { title: 'Pending Tickets', value: '12', change: '-2.1%', trend: 'down', icon: Activity, color: 'text-red-500' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Dashboard Overview</h1>
          <p className="text-gray-400">System analytics and revenue metrics.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-red-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-dark-card border border-dark-border"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-[#5ebdff]' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold font-mono tracking-tighter text-white/90">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-dark-card border border-dark-border h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6 text-white/80">Revenue Overview</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="p-6 rounded-2xl bg-dark-card border border-dark-border flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6 text-white/80">Recent Activities</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {[
              { text: "User @alex completed a $50 deposit via Crypto.", time: "2 min ago" },
              { text: "New order #45231 placed for IG Followers.", time: "15 min ago" },
              { text: "Ticket #6293 created by @johndoe.", time: "1 hour ago" },
              { text: "API balance running low (Provider A).", time: "2 hours ago", alert: true },
              { text: "User @sara registered.", time: "5 hours ago" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${act.alert ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
                <div>
                  <p className={`text-sm ${act.alert ? 'text-red-400 font-medium' : 'text-gray-300'}`}>{act.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
