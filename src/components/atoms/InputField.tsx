import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { Field, useField } from "formik";

interface Props {
  name: string;
  label?: string;
  placeholder: string;
}

export const InputField = ({ name, label, placeholder }: Props) => {
  const [field, { error, touched }] = useField(name);

  return (
    <FormControl isInvalid={Boolean(error && touched)}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input {...field} id={name} placeholder={placeholder}/>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null} 
    </FormControl>
  )
};
