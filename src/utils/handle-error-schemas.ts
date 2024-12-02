import z from "zod";

const handleErrorSchema = (errors: z.ZodIssue[]) => {
  const formattedErrors = errors.reduce((acc, item) => {
    return (acc = {
      ...acc,
      [item.path[0] ?? "unknown"]: item.path[0] ? item.message : item.code,
    });
  }, {}) as Record<z.ZodIssue["path"][0], z.ZodIssue["message"]>;

  return formattedErrors;
};

export default handleErrorSchema;
