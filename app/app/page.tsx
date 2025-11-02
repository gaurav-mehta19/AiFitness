"use client";

import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import FitnessForm from "@/components/FitnessForm";
import FitnessPlanDisplay from "@/components/FitnessPlanDisplay";
import ErrorAlert from "@/components/ErrorAlert";
import { useFitnessStore } from "@/store/store";
import { getAllImages, saveImage, deleteImage } from "@/lib/imageStorage";

export default function Home() {
  const formData = useFitnessStore((state) => state.formData);
  const setFormData = useFitnessStore((state) => state.setFormData);
  const response = useFitnessStore((state) => state.response);
  const setResponse = useFitnessStore((state) => state.setResponse);
  const loading = useFitnessStore((state) => state.loading);
  const setLoading = useFitnessStore((state) => state.setLoading);
  const error = useFitnessStore((state) => state.error);
  const setError = useFitnessStore((state) => state.setError);
  const copied = useFitnessStore((state) => state.copied);
  const setCopied = useFitnessStore((state) => state.setCopied);
  const showFeedback = useFitnessStore((state) => state.showFeedback);
  const setShowFeedback = useFitnessStore((state) => state.setShowFeedback);
  const feedback = useFitnessStore((state) => state.feedback);
  const setFeedback = useFitnessStore((state) => state.setFeedback);
  const playingSection = useFitnessStore((state) => state.playingSection);
  const setPlayingSection = useFitnessStore((state) => state.setPlayingSection);
  const currentAudio = useFitnessStore((state) => state.currentAudio);
  const setCurrentAudio = useFitnessStore((state) => state.setCurrentAudio);
  const generatedImages = useFitnessStore((state) => state.generatedImages);
  const setGeneratedImages = useFitnessStore((state) => state.setGeneratedImages);
  const loadingImages = useFitnessStore((state) => state.loadingImages);
  const setLoadingImages = useFitnessStore((state) => state.setLoadingImages);
  const exportingPDF = useFitnessStore((state) => state.exportingPDF);
  const setExportingPDF = useFitnessStore((state) => state.setExportingPDF);
  
  const ENABLE_IMAGE_GENERATION = true;
  const contentRef = useRef<HTMLDivElement>(null);

  // Load images from IndexedDB on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getAllImages();
        if (Object.keys(images).length > 0) {
          setGeneratedImages(images);
        }
      } catch (error) {
        console.error('Error loading images from IndexedDB:', error);
      }
    };
    loadImages();
  }, [setGeneratedImages]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Update form data using functional update to ensure we get latest state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field when user starts typing
    const currentErrors = useFitnessStore.getState().validationErrors;
    if (currentErrors[name as keyof typeof currentErrors]) {
      const { setValidationErrors } = useFitnessStore.getState();
      setValidationErrors({
        ...currentErrors,
        [name]: undefined,
      });
    }
    
    // Clear the general error message when user starts editing
    if (error) {
      setError("");
    }
  };

  const createPrompt = (isRegenerate = false): string => {
    const baseInfo = `
**Personal Information:**
- Name: ${formData.name}
- Age: ${formData.age} years
- Gender: ${formData.gender}
- Height: ${formData.height}
- Weight: ${formData.weight}

**Fitness Details:**
- Fitness Goal: ${formData.fitnessGoal || "Not specified"}
- Current Fitness Level: ${formData.fitnessLevel || "Not specified"}
- Workout Location: ${formData.workoutLocation || "Not specified"}
- Dietary Preference: ${formData.dietaryPreference || "Not specified"}

**Additional Information:**
- Medical History: ${formData.medicalHistory || "None"}
- Stress Level: ${formData.stressLevel || "Not specified"}`;

    const structure = `
## 🏋️ Workout Plan
Provide a detailed weekly workout plan including:
- Daily exercise routines (specify which days for which exercises)
- Specific exercises with sets and reps (e.g., "3 sets of 12 reps")
- Rest time between sets (e.g., "60 seconds rest")
- Warm-up and cool-down recommendations
- Progressive overload suggestions

## 🥗 Diet Plan
Create a complete daily meal plan with:
- Breakfast - detailed meal options with portion sizes
- Lunch - detailed meal options with portion sizes
- Dinner - detailed meal options with portion sizes
- Snacks - healthy snack options between meals
- Estimated calorie breakdown for each meal
- Hydration recommendations

## 💬 AI Tips & Motivation
Provide:
- Lifestyle tips specific to their fitness goal
- Posture tips and form corrections for exercises
- Sleep and recovery recommendations
- Stress management techniques
- Motivational quotes and encouraging messages
- Common mistakes to avoid
- Tips for staying consistent

Format the response in a clear, organized manner with proper headings and bullet points.`;

    if (isRegenerate) {
      return `
I previously generated the following fitness plan:

${response}

However, the user wants some changes. Here's their feedback:
"${feedback}"

Based on the same user details:
${baseInfo}

Please generate a NEW comprehensive fitness and diet plan that addresses the user's feedback while maintaining the same structure:
${structure}`;
    }

    return `
Generate a comprehensive personalized fitness and diet plan based on the following details:
${baseInfo}

Please provide the following in your response:
${structure}`;
  };

  const validationErrors = useFitnessStore((state) => state.validationErrors);
  const setValidationErrors = useFitnessStore((state) => state.setValidationErrors);

  const handleGenerate = async () => {
    // Import validation schema
    const { fitnessFormSchema } = await import('@/lib/validation');
    
    // Validate form data
    const result = fitnessFormSchema.safeParse(formData);
    
    if (!result.success) {
      // Extract errors
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      
      // Create a more specific error message
      const errorCount = Object.keys(errors).length;
      const firstError = Object.values(errors)[0];
      setError(`${errorCount} validation error${errorCount > 1 ? 's' : ''} found. ${firstError}`);
      
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/gererate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: createPrompt() }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.text);
      } else {
        setError(data.error || "Failed to generate content");
      }
    } catch (err) {
      setError("An error occurred while generating content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRegenerate = async () => {
    if (!feedback.trim()) {
      setError("Please provide feedback on what you'd like to change");
      return;
    }

    setLoading(true);
    setError("");
    setShowFeedback(false);

    try {
      const res = await fetch("/api/gererate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: createPrompt(true) }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.text);
        setFeedback("");
      } else {
        setError(data.error || "Failed to regenerate content");
      }
    } catch (err) {
      setError("An error occurred while regenerating content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractSection = (sectionType: 'workout' | 'diet' | 'motivation'): string => {
    const sections = {
      workout: ['🏋️ Workout Plan', 'workout plan'],
      diet: ['🥗 Diet Plan', 'diet plan'],
      motivation: ['💬 AI Tips & Motivation', 'tips & motivation', 'ai tips']
    };

    const sectionMarkers = sections[sectionType];
    const lines = response.split('\n');
    let startIndex = -1;
    let endIndex = lines.length;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (startIndex === -1 && sectionMarkers.some(marker => line.includes(marker.toLowerCase()))) {
        startIndex = i;
      } else if (startIndex !== -1 && line.startsWith('##') && !sectionMarkers.some(marker => line.includes(marker.toLowerCase()))) {
        endIndex = i;
        break;
      }
    }

    if (startIndex === -1) return "";
    return lines.slice(startIndex, endIndex).join('\n');
  };

  const handleSectionAudio = async (section: 'workout' | 'diet' | 'motivation') => {
    if (playingSection === section && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSection(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    const sectionText = extractSection(section);
    if (!sectionText) {
      setError(`Could not find ${section} section in the response`);
      return;
    }

    try {
      setPlayingSection(section);
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: sectionText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingSection(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError("Failed to play audio");
        setPlayingSection(null);
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (err) {
      setError("Failed to generate audio for this section");
      setPlayingSection(null);
      console.error(err);
    }
  };

  const handleGenerateImage = async (exerciseName: string, imageKey: string) => {
    if (generatedImages[imageKey]) {
      // Delete from both state and IndexedDB
      setGeneratedImages(prev => {
        const newImages = { ...prev };
        delete newImages[imageKey];
        return newImages;
      });
      await deleteImage(imageKey);
      return;
    }

    setLoadingImages(prev => ({ ...prev, [imageKey]: true }));
    setError("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: `Generate a realistic fitness image showing someone performing ${exerciseName} exercise in a gym setting` }),
      });

      if (res.ok && res.headers.get("content-type")?.includes("image")) {
        // If response is an image, convert to base64
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          // Save to state
          setGeneratedImages(prev => ({
            ...prev,
            [imageKey]: base64data
          }));
          // Save to IndexedDB for persistence
          try {
            await saveImage(imageKey, base64data);
          } catch (err) {
            console.error('Error saving image to IndexedDB:', err);
          }
        };
        reader.readAsDataURL(blob);
      } else {
        // If response is JSON (error), parse it
        const data = await res.json();
        if (data.error?.includes("quota") || data.error?.includes("429") || data.isQuotaError) {
          setError("⚠️ Image generation quota exceeded. The free tier has very limited requests. Please try again in 12-24 hours, or disable image generation by setting ENABLE_IMAGE_GENERATION to false.");
        } else {
          setError(data.error || "Failed to generate image");
        }
      }
    } catch (err) {
      setError("An error occurred while generating the image. Please try again.");
      console.error(err);
    } finally {
      setLoadingImages(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Fitness_Plan_${formData.name || "User"}_${new Date().toLocaleDateString().replace(/\//g, "-")}`,
    onBeforePrint: async () => {
      setExportingPDF(true);
    },
    onAfterPrint: async () => {
      setExportingPDF(false);
    },
    pageStyle: `
      @media print {
        body {
          margin: 0;
          padding: 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        button {
          display: none !important;
        }
        @page {
          size: A4;
          margin: 20mm;
        }
      }
    `,
  });

  const handleExportPDF = () => {
    if (!response) return;
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            AI Fitness Coach 🏋️‍♂️
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Get your personalized workout and diet plan powered by Gemini AI
          </p>
        </div>

        <FitnessForm
          formData={formData}
          onInputChange={handleInputChange}
          onGenerate={handleGenerate}
          loading={loading}
          validationErrors={validationErrors}
        />

        <ErrorAlert error={error} />

        {response && (
          <FitnessPlanDisplay
            ref={contentRef}
            response={response}
            playingSection={playingSection}
            generatedImages={generatedImages}
            loadingImages={loadingImages}
            ENABLE_IMAGE_GENERATION={ENABLE_IMAGE_GENERATION}
            onSectionAudio={handleSectionAudio}
            onGenerateImage={handleGenerateImage}
            onCopy={handleCopy}
            onExportPDF={handleExportPDF}
            onToggleFeedback={() => setShowFeedback(!showFeedback)}
            copied={copied}
            exportingPDF={exportingPDF}
            showFeedback={showFeedback}
            feedback={feedback}
            onFeedbackChange={setFeedback}
            onRegenerate={handleRegenerate}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
