/*
  Author: André Kreienbring
  Error boundaries and fallbacks for the components
  see: https://react-error-boundary-lib.vercel.app/api/get-error-message
*/
import { type FallbackProps, getErrorMessage } from "react-error-boundary";
import { Typography, Box } from "@mui/material";

export function CreateRuleErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message = getErrorMessage(error) ?? "Unknown error";
  return (
    <Box>
      <Typography>Something went wrong in the CreateRule component:</Typography>
      <Typography sx={{ color: "red" }}>{message}</Typography>
    </Box>
  );
}

export function SimpleRuleErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message = getErrorMessage(error) ?? "Unknown error";
  return (
    <Box>
      <Typography>Something went wrong in the SimpleRule component:</Typography>
      <Typography sx={{ color: "red" }}>{message}</Typography>
    </Box>
  );
}
