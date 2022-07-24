import { FieldError } from "src/generated/graphql";

export const formatErrors = (errors: FieldError[]) => (
  errors.reduce((accum: Record<string, string>, { field, message }) => {
    accum[field] = message;
    return accum;
  }, {})
);
