import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ROUTES } from 'src/constants/routes';
import Link from 'src/components/atoms/Link';
import { useDeletePostMutation } from 'src/generated/graphql';

interface Props {
  id: number;
}

const PostButtons = ({ id }: Props) => {
  const toast = useToast();
  const [{ fetching: fetchingDeletePost, error: errorDeletePost }, deletePost] = useDeletePostMutation();

  useEffect(() => {
    const errorMessage = errorDeletePost?.message;

    if (errorMessage) {
      toast({
        description: errorMessage,
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }
  }, [errorDeletePost, toast]);

  const handleDeletePost = () => deletePost({ id });

  return (
    <Flex flexDirection="row-reverse" flex={1}>
      <IconButton
        isLoading={fetchingDeletePost}
        disabled={fetchingDeletePost}
        onClick={handleDeletePost}
        height="25px"
        width="20px"
        aria-label="Delete post"
        icon={<CloseIcon width="14px" />}
      />
      <Link height="25px" textColor="black" href={ROUTES.EDIT_POST(id)}>
        <IconButton
          height="25px"
          width="20px"
          aria-label="Edit post"
          icon={<EditIcon width="14px" />}
        />
      </Link>
    </Flex>
  );
};

export default PostButtons;
