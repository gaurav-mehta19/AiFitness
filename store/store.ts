import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FormData } from '@/types/fitness';
import { ValidationErrors } from '@/lib/validation';

interface FitnessStore {
  // Form data
  formData: FormData;
  setFormData: (formData: FormData | ((prev: FormData) => FormData)) => void;
  
  // Validation errors
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  
  // Response
  response: string;
  setResponse: (response: string) => void;
  
  // Loading
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error
  error: string;
  setError: (error: string) => void;
  
  // Copied
  copied: boolean;
  setCopied: (copied: boolean) => void;
  
  // Show feedback
  showFeedback: boolean;
  setShowFeedback: (showFeedback: boolean) => void;
  
  // Feedback
  feedback: string;
  setFeedback: (feedback: string) => void;
  
  // Playing section
  playingSection: string | null;
  setPlayingSection: (playingSection: string | null) => void;
  
  // Current audio
  currentAudio: HTMLAudioElement | null;
  setCurrentAudio: (currentAudio: HTMLAudioElement | null) => void;
  
  // Generated images
  generatedImages: Record<string, string>;
  setGeneratedImages: (generatedImages: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  
  // Loading images
  loadingImages: Record<string, boolean>;
  setLoadingImages: (loadingImages: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  
  // Exporting PDF
  exportingPDF: boolean;
  setExportingPDF: (exportingPDF: boolean) => void;
}

export const useFitnessStore = create<FitnessStore>()(
  persist(
    (set) => ({
      // Form data with initial state
      formData: {
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        fitnessGoal: '',
        fitnessLevel: '',
        workoutLocation: '',
        dietaryPreference: '',
        medicalHistory: '',
        stressLevel: '',
      },
      setFormData: (formData) =>
        set((state) => ({
          formData: typeof formData === 'function' ? formData(state.formData) : formData,
        })),
      
      // Validation errors
      validationErrors: {},
      setValidationErrors: (errors) => set({ validationErrors: errors }),
      
      // Response
      response: '',
      setResponse: (response) => set({ response }),
      
      // Loading
      loading: false,
      setLoading: (loading) => set({ loading }),
      
      // Error
      error: '',
      setError: (error) => set({ error }),
      
      // Copied
      copied: false,
      setCopied: (copied) => set({ copied }),
      
      // Show feedback
      showFeedback: false,
      setShowFeedback: (showFeedback) => set({ showFeedback }),
      
      // Feedback
      feedback: '',
      setFeedback: (feedback) => set({ feedback }),
      
      // Playing section
      playingSection: null,
      setPlayingSection: (playingSection) => set({ playingSection }),
      
      // Current audio
      currentAudio: null,
      setCurrentAudio: (currentAudio) => set({ currentAudio }),
      
      // Generated images
      generatedImages: {},
      setGeneratedImages: (generatedImages) =>
        set((state) => ({
          generatedImages:
            typeof generatedImages === 'function'
              ? generatedImages(state.generatedImages)
              : generatedImages,
        })),
      
      // Loading images
      loadingImages: {},
      setLoadingImages: (loadingImages) =>
        set((state) => ({
          loadingImages:
            typeof loadingImages === 'function'
              ? loadingImages(state.loadingImages)
              : loadingImages,
        })),
      
      // Exporting PDF
      exportingPDF: false,
      setExportingPDF: (exportingPDF) => set({ exportingPDF }),
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields (excluding generatedImages - too large for localStorage)
        formData: state.formData,
        response: state.response,
        feedback: state.feedback,
      }),
    }
  )
);
