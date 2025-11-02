import { atom, AtomEffect, DefaultValue } from 'recoil';
import { FormData } from '@/types/fitness';

// Recoil effect for localStorage persistence
const localStorageEffect = <T>(key: string): AtomEffect<T> => ({ setSelf, onSet }) => {
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  }

  onSet((newValue, _oldValue, isReset) => {
    if (typeof window !== 'undefined') {
      if (isReset) {
        localStorage.removeItem(key);
      } else if (!(newValue instanceof DefaultValue)) {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    }
  });
};

// Form data atom with persistence
export const formDataState = atom<FormData>({
  key: 'formDataState',
  default: {
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
  effects: [localStorageEffect<FormData>('fitness-form-data')],
});

// Response state with persistence
export const responseState = atom<string>({
  key: 'responseState',
  default: '',
  effects: [localStorageEffect<string>('fitness-response')],
});

// Loading state
export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

// Error state
export const errorState = atom<string>({
  key: 'errorState',
  default: '',
});

// Copied state
export const copiedState = atom<boolean>({
  key: 'copiedState',
  default: false,
});

// Show feedback state
export const showFeedbackState = atom<boolean>({
  key: 'showFeedbackState',
  default: false,
});

// Feedback text state with persistence
export const feedbackState = atom<string>({
  key: 'feedbackState',
  default: '',
  effects: [localStorageEffect<string>('fitness-feedback')],
});

// Playing section state
export const playingSectionState = atom<string | null>({
  key: 'playingSectionState',
  default: null,
});

// Current audio state (not persisted)
export const currentAudioState = atom<HTMLAudioElement | null>({
  key: 'currentAudioState',
  default: null,
  dangerouslyAllowMutability: true,
});

// Generated images state with persistence
export const generatedImagesState = atom<Record<string, string>>({
  key: 'generatedImagesState',
  default: {},
  effects: [localStorageEffect<Record<string, string>>('fitness-generated-images')],
});

// Loading images state
export const loadingImagesState = atom<Record<string, boolean>>({
  key: 'loadingImagesState',
  default: {},
});

// Exporting PDF state
export const exportingPDFState = atom<boolean>({
  key: 'exportingPDFState',
  default: false,
});
