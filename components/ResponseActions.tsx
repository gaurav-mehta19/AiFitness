import { Button } from "@/components/ui/button";
import { ResponseActionsProps } from "@/types/fitness";

export default function ResponseActions({
  onCopy,
  onExportPDF,
  onToggleFeedback,
  copied,
  exportingPDF,
  showFeedback,
}: ResponseActionsProps) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        onClick={onCopy}
        variant="secondary"
        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white"
        size="sm"
      >
        {copied ? "✓ Copied!" : "📋 Copy"}
      </Button>
      <Button
        onClick={onToggleFeedback}
        variant="secondary"
        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white"
        size="sm"
      >
        🔄 Regenerate
      </Button>
      <Button
        onClick={onExportPDF}
        disabled={exportingPDF}
        variant="secondary"
        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white disabled:bg-slate-400"
        size="sm"
      >
        {exportingPDF ? "⏳ Exporting..." : "📄 Export PDF"}
      </Button>
    </div>
  );
}
