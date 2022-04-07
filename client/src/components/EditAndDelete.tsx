import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation } from '../generated/graphql';
interface EditAndDeleteProps {
  id: number;
}

export const EditAndDelete: React.FC<EditAndDeleteProps> = ({ id }) => {
  const [deletePost] = useDeletePostMutation();
  return (
    <>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          mr={4}
          as={Link}
          icon={<EditIcon />}
          aria-label='Edit post'
        />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label='Delete Post'
        onClick={() => {
          deletePost({ variables: { id } });
        }}
      />
    </>
  );
};
