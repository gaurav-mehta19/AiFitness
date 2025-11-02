"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useReactToPrint } from "react-to-print";

interface FormData {
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

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: "",
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [playingSection, setPlayingSection] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [exportingPDF, setExportingPDF] = useState(false);
  
  // Feature flag: Set to false to disable image generation (due to quota limits)
  const ENABLE_IMAGE_GENERATION = true;
  
  // Ref for the content to export
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    // Validate required fields
    if (!formData.name || !formData.age || !formData.gender || !formData.height || !formData.weight) {
      setError("Please fill in all required fields (Name, Age, Gender, Height, Weight)");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    // Create a detailed prompt from the form data
    const prompt = `
Generate a comprehensive personalized fitness and diet plan based on the following details:

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
- Stress Level: ${formData.stressLevel || "Not specified"}

Please provide the following in your response:

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

Format the response in a clear, organized manner with proper headings and bullet points.
`;

    try {
      const res = await fetch("/api/gererate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
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

    // Create a prompt that includes the previous plan and feedback
    const regeneratePrompt = `
I previously generated the following fitness plan:

${response}

However, the user wants some changes. Here's their feedback:
"${feedback}"

Based on the same user details:
- Name: ${formData.name}
- Age: ${formData.age} years
- Gender: ${formData.gender}
- Height: ${formData.height}
- Weight: ${formData.weight}
- Fitness Goal: ${formData.fitnessGoal || "Not specified"}
- Current Fitness Level: ${formData.fitnessLevel || "Not specified"}
- Workout Location: ${formData.workoutLocation || "Not specified"}
- Dietary Preference: ${formData.dietaryPreference || "Not specified"}
- Medical History: ${formData.medicalHistory || "None"}
- Stress Level: ${formData.stressLevel || "Not specified"}

Please generate a NEW comprehensive fitness and diet plan that addresses the user's feedback while maintaining the same structure:

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

Format the response in a clear, organized manner with proper headings and bullet points.
`;

    try {
      const res = await fetch("/api/gererate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: regeneratePrompt }),
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

  const extractSection = (text: string, sectionTitle: string): string => {
    // Extract content between section headers
    const sectionRegex = new RegExp(
      `##\\s*${sectionTitle}[^\\n]*([\\s\\S]*?)(?=##|$)`,
      'i'
    );
    const match = text.match(sectionRegex);
    return match ? match[1].trim() : "";
  };

  const handleSectionAudio = async (section: 'workout' | 'diet' | 'motivation') => {
    // If playing the same section, stop it
    if (playingSection === section && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingSection(null);
      setCurrentAudio(null);
      return;
    }

    // If playing a different section, stop it first
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    try {
      setPlayingSection(section);
      setError(""); // Clear any previous errors
      
      // Extract the specific section
      let sectionText = "";
      switch (section) {
        case 'workout':
          sectionText = extractSection(response, "🏋️ Workout Plan");
          break;
        case 'diet':
          sectionText = extractSection(response, "🥗 Diet Plan");
          break;
        case 'motivation':
          sectionText = extractSection(response, "💬 AI Tips & Motivation");
          break;
      }

      if (!sectionText) {
        setError(`Could not find the ${section} section in the plan.`);
        setPlayingSection(null);
        return;
      }
      
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: sectionText }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setPlayingSection(null);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setPlayingSection(null);
          setCurrentAudio(null);
          setError("Failed to play audio. Please try again.");
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else {
        const data = await res.json();
        console.error("TTS API error:", data);
        setError(data.details || data.error || "Failed to generate speech.");
        setPlayingSection(null);
      }
    } catch (err) {
      setError("An error occurred while generating speech. Please try again.");
      console.error(err);
      setPlayingSection(null);
    }
  };

  const handleGenerateImage = async (exerciseName: string) => {
    const imageKey = exerciseName.toLowerCase().replace(/\s+/g, '-');
    
    // If image already exists, toggle visibility
    if (generatedImages[imageKey]) {
      setGeneratedImages(prev => {
        const newImages = { ...prev };
        delete newImages[imageKey];
        return newImages;
      });
      return;
    }

    try {
      setLoadingImages(prev => ({ ...prev, [imageKey]: true }));
      setError("");

      // Create a prompt for the exercise image
      const imagePrompt = `Create a clear, professional demonstration image showing proper form and technique for the exercise: ${exerciseName}. The image should show a person performing the exercise with correct posture in a gym or home workout setting. Focus on proper form, body positioning, and technique.`;

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      console.log("Image generation response status:", res.status, res.statusText);
      
      if (res.ok) {
        const imageBlob = await res.blob();
        console.log("Image blob received, size:", imageBlob.size, "type:", imageBlob.type);
        const imageUrl = URL.createObjectURL(imageBlob);
        
        setGeneratedImages(prev => ({
          ...prev,
          [imageKey]: imageUrl,
        }));
      } else {
        const contentType = res.headers.get("content-type");
        console.log("Error response content-type:", contentType);
        
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          console.error("Image generation error:", data);
          
          if (res.status === 429 || data.isQuotaError) {
            setError(`⏱️ API Quota Exceeded: You've reached the free tier limit. Please wait a minute and try again, or upgrade your Gemini API plan.`);
          } else {
            setError(`Failed to generate image: ${data.error || data.details || "Unknown error"}`);
          }
        } else {
          const text = await res.text();
          console.error("Image generation error (non-JSON):", text.substring(0, 200));
          setError(`Failed to generate image: ${res.status} ${res.statusText}`);
        }
      }
    } catch (err) {
      setError("An error occurred while generating the image. Please try again.");
      console.error(err);
    } finally {
      setLoadingImages(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  // Using react-to-print for better CSS compatibility
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

  console.log(formData);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🏋️ AI Fitness & Diet Plan Generator
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Your Details
          </h2>

          <form className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-2 text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium mb-2 text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium mb-2 text-gray-700">
                  Height <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 5'11&quot; or 180cm"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-2 text-gray-700">
                  Weight <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 90kg or 200lbs"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Fitness Details Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Fitness Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fitnessGoal" className="block text-sm font-medium mb-2 text-gray-700">
                    Fitness Goal
                  </label>
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Strength Building">Strength Building</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fitnessLevel" className="block text-sm font-medium mb-2 text-gray-700">
                    Current Fitness Level
                  </label>
                  <select
                    id="fitnessLevel"
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="workoutLocation" className="block text-sm font-medium mb-2 text-gray-700">
                    Workout Location
                  </label>
                  <select
                    id="workoutLocation"
                    name="workoutLocation"
                    value={formData.workoutLocation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Location</option>
                    <option value="Home">Home</option>
                    <option value="Gym">Gym</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Hybrid">Hybrid (Mix)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dietaryPreference" className="block text-sm font-medium mb-2 text-gray-700">
                    Dietary Preference
                  </label>
                  <select
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Preference</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stressLevel" className="block text-sm font-medium mb-2 text-gray-700">
                    Stress Level
                  </label>
                  <select
                    id="stressLevel"
                    name="stressLevel"
                    value={formData.stressLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select Level</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="medicalHistory" className="block text-sm font-medium mb-2 text-gray-700">
                    Medical History / Health Conditions
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Any medical conditions, injuries, or health concerns..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </form>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating Your Plan..." : "🚀 Generate Fitness Plan"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {response && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Personalized Plan 📋
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exportingPDF}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {exportingPDF ? "⏳ Exporting..." : "📄 Export PDF"}
                </button>
              </div>
            </div>

            {showFeedback && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label htmlFor="feedback" className="block text-sm font-medium mb-2 text-gray-700">
                  What would you like to change in this plan?
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="E.g., 'I want more cardio exercises', 'Can you add more vegetarian protein options?', 'Make the workouts shorter', etc."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Regenerating..." : "Generate New Plan"}
                </button>
              </div>
            )}

            <div ref={contentRef} className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />
                  ),
                  h2: ({ children, ...props }) => {
                    const text = children?.toString() || "";
                    let section: 'workout' | 'diet' | 'motivation' | null = null;
                    
                    if (text.includes("🏋️") || text.toLowerCase().includes("workout")) {
                      section = "workout";
                    } else if (text.includes("🥗") || text.toLowerCase().includes("diet")) {
                      section = "diet";
                    } else if (text.includes("💬") || text.toLowerCase().includes("tips") || text.toLowerCase().includes("motivation")) {
                      section = "motivation";
                    }

                    return (
                      <div className="flex items-center justify-between mt-6 mb-3 border-b-2 border-gray-300 pb-2">
                        <h2 className="text-2xl font-bold text-gray-800" {...props}>
                          {children}
                        </h2>
                        {section && (
                          <button
                            onClick={() => handleSectionAudio(section as 'workout' | 'diet' | 'motivation')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                              playingSection === section
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                          >
                            {playingSection === section ? "⏸️ Stop" : "🔊 Listen"}
                          </button>
                        )}
                      </div>
                    );
                  },
                  h3: ({ ...props }) => (
                    <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800" {...props} />
                  ),
                  h4: ({ ...props }) => (
                    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-700" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-4 leading-relaxed text-gray-700" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />
                  ),
                  li: ({ children, ...props }) => {
                    const text = children?.toString() || "";
                    // Check if this looks like an exercise (contains "sets", "reps", or exercise keywords)
                    const isExercise = /\d+\s*sets|sets\s*of|reps|push[-\s]?ups?|squats?|lunges?|curls?|press|rows?|pull[-\s]?ups?|deadlift|plank/i.test(text);
                    
                    if (isExercise && ENABLE_IMAGE_GENERATION) {
                      // Extract exercise name (text before colon or first number)
                      const exerciseName = text.split(/:|–|-|\d/)[0].trim();
                      const imageKey = exerciseName.toLowerCase().replace(/\s+/g, '-');
                      const hasImage = generatedImages[imageKey];
                      const isLoading = loadingImages[imageKey];

                      return (
                        <li className="text-gray-700 leading-relaxed" {...props}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex-1">{children}</span>
                            <button
                              onClick={() => handleGenerateImage(exerciseName)}
                              disabled={isLoading}
                              className={`shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors ${
                                hasImage
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                              {isLoading ? "⏳" : hasImage ? "✕ Hide" : "🖼️ Show"}
                            </button>
                          </div>
                          {hasImage && (
                            <div className="mt-2 ml-6">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={generatedImages[imageKey]}
                                alt={exerciseName}
                                className="max-w-sm rounded-lg shadow-md border border-gray-300"
                              />
                            </div>
                          )}
                        </li>
                      );
                    }

                    return <li className="text-gray-700 leading-relaxed" {...props}>{children}</li>;
                  },
                  strong: ({ ...props }) => (
                    <strong className="font-bold text-gray-900" {...props} />
                  ),
                  em: ({ ...props }) => (
                    <em className="italic text-gray-700" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600" {...props} />
                  ),
                  code: ({ ...props }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props} />
                  ),
                  pre: ({ ...props }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                  ),
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead className="bg-gray-100" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />
                  ),
                  tr: ({ ...props }) => (
                    <tr className="hover:bg-gray-50" {...props} />
                  ),
                  hr: ({ ...props }) => (
                    <hr className="my-6 border-t-2 border-gray-300" {...props} />
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
