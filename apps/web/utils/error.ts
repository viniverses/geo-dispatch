export const getErrorMessage = (error: unknown): string | null => {
  if (error instanceof Error) {
    return error.message;
  }
  return null;
};
