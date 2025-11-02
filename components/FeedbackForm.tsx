import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackFormProps } from "@/types/fitness";

export default function FeedbackForm({ feedback, onFeedbackChange, onRegenerate, loading }: FeedbackFormProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="feedback">
            What would you like to change in this plan?
          </Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="E.g., 'I want more cardio exercises', 'Can you add more vegetarian protein options?', 'Make the workouts shorter', etc."
            className="h-24 resize-vertical"
          />
          <Button
            onClick={onRegenerate}
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            {loading ? "Regenerating..." : "Generate New Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
