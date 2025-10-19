// components/Dashboard.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
    data: {
        taxSavings: number;
        cibilScore: number;
        expenses: Array<{
            category: string;
            amount: number;
        }>;
    };
}

export function Dashboard({ data }: DashboardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tax Savings Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3>Potential Tax Savings</h3>
                <p className="text-2xl font-bold">₹{data.taxSavings}</p>
            </div>
            
            {/* CIBIL Score Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3>CIBIL Score</h3>
                <p className="text-2xl font-bold">{data.cibilScore}</p>
            </div>
            
            {/* Spending Chart */}
            <div className="bg-white p-6 rounded-lg shadow col-span-full">
                <BarChart width={600} height={300} data={data.expenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
            </div>
        </div>
    );
}