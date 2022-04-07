import { useApolloClient } from '@apollo/client';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href={'/login'}>
          <Link textDecoration={'none'} color='black' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href={'/register'}>
          <Link color='black' mr={2}>
            Signup
          </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align={'center'}>
        <NextLink href='/createPost'>
          <Button
            style={{ textDecoration: 'none', border: 'none' }}
            size='md'
            bg={'dark'}
            as={Link}
            mr={4}
          >
            create post
          </Button>
        </NextLink>
        <NextLink href='/profile/[id]' as={`/profile/${data.me.id}`}>
          <Link mr={2}>{data.me.username}</Link>
        </NextLink>
        <Button
          style={{ textDecoration: 'none', border: 'none' }}
          variant={'link'}
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            await apolloClient.clearStore();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position={'sticky'} top={'0'} zIndex={1} bg={'skyblue'} px={4}>
      <Flex maxW={900} flex={1} align='center' m={'auto'}>
        <NextLink href={'/'}>
          <Link
            style={{
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            ShitPost
          </Link>
        </NextLink>
        <Box ml={'auto'} p={6}>
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
