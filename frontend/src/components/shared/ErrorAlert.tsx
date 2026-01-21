import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ErrorAlertProps = {
  error: string;
};

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="pr-8">{error}</AlertDescription>
    </Alert>
  );
};
