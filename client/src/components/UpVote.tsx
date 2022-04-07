import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpVoteProps {
  post: PostSnippetFragment;
}

export const UpVote: React.FC<UpVoteProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();

  return (
    <Flex
      justifyContent={'flex-start'}
      alignItems={'center'}
      direction={'row'}
      mt={2}
    >
      <IconButton
        mr={4}
        size='xs'
        colorScheme={post.voteStatus == 1 ? 'teal' : undefined}
        onClick={async () => {
          if (post.voteStatus == 1) {
            return;
          }
          setLoadingState('updoot-loading');
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'updoot-loading'}
        aria-label='updoot post'
        icon={<ChevronUpIcon />}
      />
      <Box mr={4}> {post.points}</Box>
      <IconButton
        size={'xs'}
        onClick={async () => {
          if (post.voteStatus == 1) {
            return;
          }
          setLoadingState('downdoot-loading');
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus == -1 ? 'teal' : undefined}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label='updoot post'
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
