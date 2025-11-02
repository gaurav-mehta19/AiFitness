export interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory: string;
  stressLevel: string;
}

export interface FitnessFormProps {
  formData: FormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onGenerate: () => void;
  loading: boolean;
}

export interface ResponseActionsProps {
  onCopy: () => void;
  onExportPDF: () => void;
  onToggleFeedback: () => void;
  copied: boolean;
  exportingPDF: boolean;
  showFeedback: boolean;
}

export interface FeedbackFormProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onRegenerate: () => void;
  loading: boolean;
}
