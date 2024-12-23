import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const salesData = [
	{ name: "Week 1", sales: 42 },
	{ name: "Week 2", sales: 38 },
	{ name: "Week 3", sales: 51 },
	{ name: "Week 4", sales: 46 },
	{ name: "Week 5", sales: 54 },
	{ name: "Week 6", sales: 72 },
	{ name: "Week 7", sales: 61 },
];

const TimeSeriesGraph = ({ title }) => {
	return (
		<motion.div
			className='bg-gray-200  backdrop-blur-md shadow-lg rounded-xl p-6 '
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-black'>{title}</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#333333' />
						<YAxis stroke='#333333' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='sales'
							stroke='#FFD93D'
							strokeWidth={3}
							dot={{ fill: "#FFD93D", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default TimeSeriesGraph;
