import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';

interface Props {
  name: string;
  label?: string;
  isTextArea?: boolean;
  placeholder: string;
}

export const InputField = ({ name, label, placeholder, isTextArea }: Props) => {
  const [field, { error, touched }] = useField(name);

  return (
    <FormControl isInvalid={Boolean(error && touched)}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {isTextArea
        ? <Textarea {...field} id={name} placeholder={placeholder} />
        : <Input {...field} id={name} placeholder={placeholder} /> }
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
