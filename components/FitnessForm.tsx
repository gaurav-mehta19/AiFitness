import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FitnessFormProps } from "@/types/fitness";
import { ValidationErrors } from "@/lib/validation";

interface FitnessFormPropsWithValidation extends FitnessFormProps {
  validationErrors?: ValidationErrors;
}

export default function FitnessForm({ formData, onInputChange, onGenerate, loading, validationErrors = {} }: FitnessFormPropsWithValidation) {
  const handleSelectChange = (name: string, value: string) => {
    const event = {
      target: { name, value }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900 dark:text-white">Personal Fitness Plan Generator 💪</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Fill in your details to get a customized workout and diet plan powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Enter your name"
                  required
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={onInputChange}
                  placeholder="Enter your age"
                  required
                  className={validationErrors.age ? "border-red-500" : ""}
                />
                {validationErrors.age && (
                  <p className="text-sm text-red-500">{validationErrors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className={validationErrors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.gender && (
                  <p className="text-sm text-red-500">{validationErrors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={onInputChange}
                  placeholder="e.g., 180"
                  required
                  className={validationErrors.height ? "border-red-500" : ""}
                />
                {validationErrors.height && (
                  <p className="text-sm text-red-500">{validationErrors.height}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={onInputChange}
                  placeholder="e.g., 75"
                  required
                  className={validationErrors.weight ? "border-red-500" : ""}
                />
                {validationErrors.weight && (
                  <p className="text-sm text-red-500">{validationErrors.weight}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fitness Details Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Fitness Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select
                  value={formData.fitnessGoal}
                  onValueChange={(value) => handleSelectChange("fitnessGoal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Strength Building">Strength Building</SelectItem>
                    <SelectItem value="Endurance">Endurance</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workoutLocation">Workout Location</Label>
                <Select
                  value={formData.workoutLocation}
                  onValueChange={(value) => handleSelectChange("workoutLocation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Hybrid">Hybrid (Mix)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                <Select
                  value={formData.dietaryPreference}
                  onValueChange={(value) => handleSelectChange("dietaryPreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Keto">Keto</SelectItem>
                    <SelectItem value="Paleo">Paleo</SelectItem>
                    <SelectItem value="No Preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Optional Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Additional Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stressLevel">Stress Level</Label>
                <Select
                  value={formData.stressLevel}
                  onValueChange={(value) => handleSelectChange("stressLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="medicalHistory">Medical History / Health Conditions</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={onInputChange}
                  placeholder="Any medical conditions, injuries, or health concerns..."
                  className="resize-vertical"
                />
              </div>
            </div>
          </div>
        </form>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
          size="lg"
        >
          {loading ? "Generating Your Plan..." : "🚀 Generate Fitness Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}
