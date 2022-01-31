import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  let errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  console.log(errorMap);
  return errorMap;
};
