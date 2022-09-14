import { Box, Heading, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  textSnippet: string;
}

export const Post = ({ textSnippet, title }: Props) => (
  <Box mb={5} p={5} shadow='md' borderWidth='1px'>
    <Heading fontSize='xl'>{title}</Heading>
    <Text mt={4}>{textSnippet}</Text>
  </Box>
);
