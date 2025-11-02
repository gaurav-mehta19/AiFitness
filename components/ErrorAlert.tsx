import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorAlertProps {
  error: string;
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
