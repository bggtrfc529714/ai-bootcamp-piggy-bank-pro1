import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Goal } from "@/pages/Index";

interface GoalsTabProps {
  goals: Goal[];
  balance: number;
  onAddGoal: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateProgress: (id: string, amount: number) => void;
}

const GoalsTab = ({ goals, balance, onAddGoal, onDeleteGoal, onUpdateProgress }: GoalsTabProps) => {
  const { toast } = useToast();
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Oops!",
        description: "Please enter a valid target amount!",
        variant: "destructive",
      });
      return;
    }

    if (!goalName.trim()) {
      toast({
        title: "Hold on!",
        description: "Please name your goal!",
        variant: "destructive",
      });
      return;
    }

    onAddGoal({
      name: goalName.trim(),
      targetAmount: amount,
    });

    toast({
      title: "Goal Created! 🎯",
      description: `Let's save for ${goalName}!`,
    });

    setGoalName("");
    setTargetAmount("");
  };

  const handleAddToGoal = (goal: Goal, amount: number) => {
    if (amount > balance) {
      toast({
        title: "Not enough money!",
        description: "You don't have enough balance to add this amount.",
        variant: "destructive",
      });
      return;
    }

    onUpdateProgress(goal.id, amount);
    toast({
      title: "Progress! 🎉",
      description: `Added $${amount.toFixed(2)} to ${goal.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Goal Form */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Savings Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">What are you saving for?</Label>
              <Input
                id="goalName"
                placeholder="e.g., New Bike, Video Game, Toy..."
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">How much do you need? ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-accent text-white text-lg py-6 hover:opacity-90 transition-opacity"
            >
              ➕ Add Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No savings goals yet. Create one above! 👆
              </p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = progress >= 100;

            return (
              <Card key={goal.id} className="border-2 overflow-hidden">
                <div className={`p-1 ${isComplete ? "gradient-accent" : "gradient-secondary"}`} />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className={`w-6 h-6 ${isComplete ? "text-accent" : "text-goal"}`} />
                      <div>
                        <h3 className="text-xl font-bold">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Progress value={progress} className="h-3 mb-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {isComplete ? "Goal Reached! 🎉" : `${progress.toFixed(0)}% Complete`}
                    </span>
                    {!isComplete && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToGoal(goal, 5)}
                          disabled={balance < 5}
                          className="hover:bg-accent/10"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          $5
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToGoal(goal, 10)}
                          disabled={balance < 10}
                          className="hover:bg-accent/10"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          $10
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsTab;
