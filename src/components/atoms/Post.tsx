import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

import { PostsQuery, useVoteMutation } from 'src/generated/graphql';

type PostType = PostsQuery['posts']['data'][0];

interface Props extends PostType {
  title: string;
}

export const Post = ({ textSnippet, voteStatus, id, title, creator, points }: Props) => {
  const toast = useToast();
  const [{ fetching: fetchingVoteUp, error: errorVoteUp }, voteUp] = useVoteMutation();
  const [{ fetching: fetchingVoteDown, error: errorVoteDown }, voteDown] = useVoteMutation();

  useEffect(() => {
    let errorMessage = errorVoteUp?.message;

    if (errorVoteDown?.message) {
      errorMessage = errorVoteDown?.message;
    }

    if (errorMessage) {
      toast({
        description: errorMessage,
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  }, [errorVoteUp, errorVoteDown, toast]);

  const handleVoteUp = () => !isVotedUp && voteUp({ value: 1, postId: id });
  const handleVoteDown = () => !isVotedDown && voteDown({ value: -1, postId: id });

  const isVotedUp = voteStatus === 1;
  const isVotedDown = voteStatus === -1;

  return (
    <Flex mb={5} p={5} shadow="md" borderWidth="1px">
      <Flex mr={4} flexDir="column">
        <IconButton
          onClick={handleVoteUp}
          isLoading={fetchingVoteUp}
          disabled={fetchingVoteDown}
          aria-label="Updoot Up"
          color={isVotedUp ? 'green' : undefined}
          background="none"
          height="24px"
          icon={<ChevronUpIcon cursor="pointer" />}
        />
        <Text fontSize={14} textAlign="center">{points}</Text>
        <IconButton
          isLoading={fetchingVoteDown}
          disabled={fetchingVoteUp}
          background="none"
          color={voteStatus === -1 ? 'red' : undefined}
          onClick={handleVoteDown}
          height="24px"
          aria-label="Updoot Down"
          icon={<ChevronDownIcon cursor="pointer" />}
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{title}</Heading>
        <Text fontSize={14} fontStyle="italic">{creator.nick_name}</Text>
        <Text mt={4}>{textSnippet}</Text>
      </Box>
    </Flex>
  );
};
