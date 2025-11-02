import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponseActions from "./ResponseActions";
import FeedbackForm from "./FeedbackForm";

interface FitnessPlanDisplayProps {
  response: string;
  playingSection: string | null;
  generatedImages: Record<string, string>;
  loadingImages: Record<string, boolean>;
  ENABLE_IMAGE_GENERATION: boolean;
  onSectionAudio: (section: 'workout' | 'diet' | 'motivation') => void;
  onGenerateImage: (exerciseName: string, imageKey: string, itemType?: 'exercise' | 'food') => void;
  onCopy: () => void;
  onExportPDF: () => void;
  onToggleFeedback: () => void;
  copied: boolean;
  exportingPDF: boolean;
  showFeedback: boolean;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onRegenerate: () => void;
  loading: boolean;
}

const FitnessPlanDisplay = forwardRef<HTMLDivElement, FitnessPlanDisplayProps>(
  (
    {
      response,
      playingSection,
      generatedImages,
      loadingImages,
      ENABLE_IMAGE_GENERATION,
      onSectionAudio,
      onGenerateImage,
      onCopy,
      onExportPDF,
      onToggleFeedback,
      copied,
      exportingPDF,
      showFeedback,
      feedback,
      onFeedbackChange,
      onRegenerate,
      loading,
    },
    ref
  ) => {
    return (
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <CardTitle className="text-slate-900 dark:text-white">Your Personalized Plan 📋</CardTitle>
            <ResponseActions
              onCopy={onCopy}
              onExportPDF={onExportPDF}
              onToggleFeedback={onToggleFeedback}
              copied={copied}
              exportingPDF={exportingPDF}
              showFeedback={showFeedback}
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {showFeedback && (
            <FeedbackForm
              feedback={feedback}
              onFeedbackChange={onFeedbackChange}
              onRegenerate={onRegenerate}
              loading={loading}
            />
          )}

          <div ref={ref} className="max-w-none text-slate-700 dark:text-slate-300 space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="text-3xl font-bold mt-6 mb-4 text-slate-900 dark:text-white" {...props} />
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
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-8 mb-4 border-b-2 border-slate-300 dark:border-slate-700 pb-2">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white" {...props}>
                        {children}
                      </h2>
                      {section && (
                        <button
                          type="button"
                          onClick={() => onSectionAudio(section)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shrink-0 ${
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
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-900 dark:text-slate-100" {...props} />
                ),
                h4: ({ ...props }) => (
                  <h4 className="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-200" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-outside mb-4 space-y-2 ml-6 pl-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-outside mb-4 space-y-2 ml-6 pl-2" {...props} />
                ),
                li: ({ children, ...props }) => {
                  // Convert children to string more reliably - extract text from React elements
                  const extractText = (node: unknown): string => {
                    if (typeof node === "string") return node;
                    if (typeof node === "number") return String(node);
                    if (Array.isArray(node)) return node.map(extractText).join("");
                    if (node && typeof node === "object" && !Array.isArray(node)) {
                      const obj = node as Record<string, unknown>;
                      if ("props" in obj && obj.props && typeof obj.props === "object" && "children" in obj.props) {
                        return extractText((obj.props as Record<string, unknown>).children);
                      }
                    }
                    return "";
                  };
                  
                  const text = extractText(children);
                  // Check if it's an exercise OR a food/meal item
                  const isExercise = /\d+\s*sets|sets\s*of|reps|push[-\s]?ups?|squats?|lunges?|curls?|press|rows?|pull[-\s]?ups?|deadlift|plank/i.test(text);
                  const isFoodItem = /breakfast|lunch|dinner|snack|meal|protein|chicken|fish|egg|oats|rice|salad|vegetables|fruits|smoothie|shake|paneer|tofu|lentils|dal|curry|roti|chapati|quinoa|nuts|yogurt|milk|cheese|avocado|beans|pasta|bread|wrap|bowl|serving|cup|tbsp|grams?|calories/i.test(text);
                  
                  if ((isExercise || isFoodItem) && ENABLE_IMAGE_GENERATION) {
                    // Extract exercise name more carefully - get everything before the first colon, dash, or number
                    let exerciseName = text.trim();
                    const match = text.match(/^([^:–\-\d]+)/);
                    if (match) {
                      exerciseName = match[1].trim();
                    }
                    // Remove common prefixes like bullet points, asterisks
                    exerciseName = exerciseName.replace(/^[•\-\*\s]+/, '').trim();
                    
                    // Create a unique key by combining exercise name with a hash of the full text
                    // This ensures each list item has a unique key even if exercise names are similar
                    const textHash = text.split('').reduce((acc, char) => {
                      return ((acc << 5) - acc) + char.charCodeAt(0);
                    }, 0);
                    const imageKey = `${exerciseName.toLowerCase().replace(/\s+/g, '-')}-${Math.abs(textHash)}`;
                    const hasImage = generatedImages[imageKey];
                    const isLoading = loadingImages[imageKey];

                    return (
                      <li className="text-slate-700 dark:text-slate-300 leading-relaxed list-item" {...props}>
                        <div className="flex items-center justify-between gap-3 -ml-1">
                          <span className="flex-1 wrap-break-word">{children}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              console.log('Clicked:', exerciseName, 'Key:', imageKey, 'Type:', isFoodItem ? 'food' : 'exercise');
                              onGenerateImage(exerciseName, imageKey, isFoodItem ? 'food' : 'exercise');
                            }}
                            disabled={isLoading}
                            className={`shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                              hasImage
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            } disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed`}
                          >
                            {isLoading ? "⏳" : hasImage ? "✕ Hide" : "🖼️ Show"}
                          </button>
                        </div>
                        {isLoading && (
                          <div className="mt-2 ml-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">Generating image...</span>
                            </div>
                          </div>
                        )}
                        {hasImage && (
                          <>
                            <div className="mt-2 ml-6 relative group">
                              <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={generatedImages[imageKey]}
                                  alt={exerciseName}
                                  className="max-w-sm rounded-lg shadow-md border border-slate-300 dark:border-slate-700 cursor-pointer transition-opacity hover:opacity-90"
                                  onClick={() => {
                                    const modal = document.getElementById(`modal-${imageKey}`);
                                    if (modal) {
                                      modal.classList.remove('hidden');
                                      modal.classList.add('flex');
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const modal = document.getElementById(`modal-${imageKey}`);
                                    if (modal) {
                                      modal.classList.remove('hidden');
                                      modal.classList.add('flex');
                                    }
                                  }}
                                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Click to zoom"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {/* Zoom Modal */}
                            <div
                              id={`modal-${imageKey}`}
                              className="hidden fixed inset-0 z-50 bg-black/90 items-center justify-center p-4"
                              onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                  const modal = document.getElementById(`modal-${imageKey}`);
                                  if (modal) {
                                    modal.classList.add('hidden');
                                    modal.classList.remove('flex');
                                  }
                                }
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const modal = document.getElementById(`modal-${imageKey}`);
                                  if (modal) {
                                    modal.classList.add('hidden');
                                    modal.classList.remove('flex');
                                  }
                                }}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                title="Close (ESC)"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={generatedImages[imageKey]}
                                alt={exerciseName}
                                className="max-w-full max-h-full object-contain rounded-lg"
                              />
                            </div>
                          </>
                        )}
                      </li>
                    );
                  }

                  return <li className="text-slate-700 dark:text-slate-300 leading-relaxed" {...props}>{children}</li>;
                },
                strong: ({ ...props }) => (
                  <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                ),
                em: ({ ...props }) => (
                  <em className="italic text-slate-700 dark:text-slate-300" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-slate-600 dark:text-slate-400" {...props} />
                ),
                code: ({ ...props }) => (
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400" {...props} />
                ),
                pre: ({ ...props }) => (
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4 text-slate-800 dark:text-slate-200" {...props} />
                ),
                table: ({ ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700" {...props} />
                  </div>
                ),
                thead: ({ ...props }) => (
                  <thead className="bg-slate-100 dark:bg-slate-800" {...props} />
                ),
                th: ({ ...props }) => (
                  <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-300" {...props} />
                ),
                tr: ({ ...props }) => (
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50" {...props} />
                ),
                hr: ({ ...props }) => (
                  <hr className="my-6 border-t-2 border-slate-300 dark:border-slate-700" {...props} />
                ),
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FitnessPlanDisplay.displayName = "FitnessPlanDisplay";

export default FitnessPlanDisplay;
