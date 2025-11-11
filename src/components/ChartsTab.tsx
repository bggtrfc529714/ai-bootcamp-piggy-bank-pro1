import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart3, PieChart } from "lucide-react";
import type { Transaction } from "@/pages/Index";

interface ChartsTabProps {
  transactions: Transaction[];
}

const ChartsTab = ({ transactions }: ChartsTabProps) => {
  const [chartType, setChartType] = useState<"income-expense" | "category">("income-expense");

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryData = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryData).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Chart Type Buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          variant={chartType === "income-expense" ? "default" : "outline"}
          onClick={() => setChartType("income-expense")}
          className={
            chartType === "income-expense"
              ? "gradient-secondary text-white hover:opacity-90"
              : ""
          }
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Income vs Expenses
        </Button>
        <Button
          variant={chartType === "category" ? "default" : "outline"}
          onClick={() => setChartType("category")}
          className={
            chartType === "category" ? "gradient-primary text-white hover:opacity-90" : ""
          }
        >
          <PieChart className="w-4 h-4 mr-2" />
          Spending by Category
        </Button>
      </div>

      {/* Chart Display */}
      {chartType === "income-expense" ? (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">📊 Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data yet. Add some transactions first! 📝
              </p>
            ) : (
              <div className="space-y-6">
                {/* Income Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-income">💵 Money In</span>
                    <span className="font-bold text-income">${totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="h-12 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full gradient-accent flex items-center justify-end px-4 transition-all duration-500"
                      style={{
                        width: `${
                          totalIncome + totalExpense > 0
                            ? (totalIncome / (totalIncome + totalExpense)) * 100
                            : 0
                        }%`,
                      }}
                    >
                      <span className="text-white font-bold text-sm">
                        {totalIncome + totalExpense > 0
                          ? `${((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expense Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-expense">💸 Money Out</span>
                    <span className="font-bold text-expense">${totalExpense.toFixed(2)}</span>
                  </div>
                  <div className="h-12 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-destructive to-red-400 flex items-center justify-end px-4 transition-all duration-500"
                      style={{
                        width: `${
                          totalIncome + totalExpense > 0
                            ? (totalExpense / (totalIncome + totalExpense)) * 100
                            : 0
                        }%`,
                      }}
                    >
                      <span className="text-white font-bold text-sm">
                        {totalIncome + totalExpense > 0
                          ? `${((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Balance:</span>
                    <span
                      className={`text-2xl font-bold ${
                        totalIncome - totalExpense >= 0 ? "text-income" : "text-expense"
                      }`}
                    >
                      ${(totalIncome - totalExpense).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">🥧 Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {totalExpense === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No expenses yet. Start tracking your spending! 💰
              </p>
            ) : (
              <div className="space-y-4">
                {sortedCategories.map(([category, amount], index) => {
                  const percentage = (amount / totalExpense) * 100;
                  const colors = [
                    "from-primary to-orange-400",
                    "from-secondary to-blue-400",
                    "from-accent to-green-400",
                    "from-purple-500 to-purple-400",
                    "from-pink-500 to-pink-400",
                    "from-yellow-500 to-yellow-400",
                  ];
                  const colorClass = colors[index % colors.length];

                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{category}</span>
                        <span className="font-bold">${amount.toFixed(2)}</span>
                      </div>
                      <div className="h-10 bg-muted rounded-lg overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colorClass} flex items-center justify-end px-4 transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white font-bold text-sm">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartsTab;
