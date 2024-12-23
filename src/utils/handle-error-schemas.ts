import z from "zod";

const handleErrorSchema = <E>(errors: z.ZodError<E>) => {
  const schemaErrors = errors.format();
  const keys = Object.keys(schemaErrors).slice(1);
  if (!keys) return {};

  const formattedErrors = keys.reduce((acc, key) => {
    const getError = schemaErrors[key as keyof typeof schemaErrors];
    if (getError === undefined) return acc;

    if (key === "profile_links") {
      return {
        ...acc,
        [key]: getError ?? [],
      };
    }

    return {
      ...acc,
      [key]:
        (getError as { _errors: Array<unknown> })._errors?.[0] ??
        "This field has an error",
    };
  }, {});

  return formattedErrors;
};

export default handleErrorSchema;
