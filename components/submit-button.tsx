"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ text = 'Save', disabled, varient, handleClick }: { disabled: boolean, varient: "default" | "secondary" | "destructive", handleClick?: () => void, text?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button onClick={handleClick} variant={varient} type="submit" disabled={pending || disabled}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
}
