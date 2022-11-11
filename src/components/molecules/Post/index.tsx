import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ROUTES } from 'src/constants/routes';

import Link from 'src/components/atoms/Link';
import { PostsQuery, useMeQuery, useVoteMutation } from 'src/generated/graphql';
import PostButtons from '../PostButtons';

type PostType = PostsQuery['posts']['data'][0];

interface Props extends PostType {
  title: string;
}

export const Post = ({ textSnippet, voteStatus, id, title, creator, points }: Props) => {
  const toast = useToast();
  const [{ data }] = useMeQuery();
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
  const isAuthenticated = Boolean(data?.me?.user);

  const isCreatorPost = creator.id === data?.me?.user?.id;

  return (
    <Flex mb={5} p={5} shadow="md" borderWidth="1px">
      <Flex mr={4} flexDir="column">
        <IconButton
          onClick={handleVoteUp}
          isLoading={fetchingVoteUp}
          disabled={fetchingVoteDown || !isAuthenticated}
          aria-label="Updoot Up"
          background={isVotedUp ? 'green' : undefined}
          color={isVotedUp ? 'white' : undefined}
          _hover={{
            color: isVotedUp ? undefined : 'teal.500'
          }}
          height="24px"
          icon={<ChevronUpIcon />}
        />
        <Text fontSize={14} textAlign="center">{points}</Text>
        <IconButton
          isLoading={fetchingVoteDown}
          disabled={fetchingVoteUp || !isAuthenticated}
          background={isVotedDown ? 'red' : undefined}
          color={isVotedDown ? 'white' : undefined}
          onClick={handleVoteDown}
          _hover={{
            color: isVotedDown ? undefined : 'teal.500'
          }}
          height="24px"
          aria-label="Updoot Down"
          icon={<ChevronDownIcon />}
        />
      </Flex>
      <Box>
        <Link textColor="black" href={ROUTES.POST(id)}>
          <Heading fontSize="xl">{title}</Heading>
        </Link>
        <Text fontSize={14} fontStyle="italic">{creator.nick_name}</Text>
        <Text mt={4}>{textSnippet}</Text>
      </Box>
      {isCreatorPost && <PostButtons id={id} />}
    </Flex>
  );
};
