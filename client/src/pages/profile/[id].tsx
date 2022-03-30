import { AtSignIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { EditAndDelete } from '../../components/EditAndDelete';
import { Layout } from '../../components/layout';
import { UserQuery, useUserQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClinet';
interface UserProps {
  _user: UserQuery;
}

const Profile: React.FC<UserProps> = ({ _user }) => {
  const [{ data, fetching }] = useUserQuery();
  if (!data) {
    return <>Somthing went wrong !</>;
  }
  return (
    <Layout>
      <Container maxW='container.xl' p={4}>
        <Box>
          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {data.user?.username}
              </Heading>
              <Text color={'gray.500'}>{data.user?.username}</Text>
            </Stack>
          </Box>
        </Box>
        <Heading fontSize={'2xl'} textAlign={'center'}>
          Your Posts
        </Heading>
        <Box mt={4} top='16'>
          <Stack p={4} spacing={8} margin={'auto'}>
            {data.user?.posts.map((post) => (
              <Box
                p={5}
                key={post.id}
                shadow='md'
                borderWidth='1px'
                borderRadius='10px'
              >
                <Flex align='center'>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Text fontFamily={'heading'} fontSize={'1.5em'}>
                        {post.title}
                      </Text>
                    </Link>
                  </NextLink>
                  <Text
                    px={2}
                    cursor='pointer'
                    fontSize='12px'
                    textDecoration={'underline'}
                  >
                    <AtSignIcon></AtSignIcon>
                    {data.user?.username}
                  </Text>
                </Flex>
                <Flex>
                  <Text px={2} mt={4}>
                    {post.textSnippet}
                  </Text>
                  <Box ml={'auto'}>
                    <EditAndDelete id={post.id}></EditAndDelete>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Profile);
