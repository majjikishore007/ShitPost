import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Menu, MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import NextLink from 'next/link';
import router from 'next/router';
import React, { ReactNode } from 'react';
import { BsMoonStarsFill, BsSun } from 'react-icons/bs';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const Links = ['create post'];
const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={4}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'/createPost'}
  >
    {children}
  </Link>
);


export const NavigationBar: React.FC<{}> = ({}) => {

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;
  if (fetching) {
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
            router.reload();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <>
      <Box
        px={6}
        py={2}
        position={'sticky'}
        top={0}
        zIndex={1}
        style={{
          backdropFilter: 'blur(5px)',
        }}
      >
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
          marginInline={'auto'}
          sx={{
            '@media(min-width:40em)': {
              maxWidth: '50%',
            },
          }}
        >
          <HStack spacing={8} alignItems={'center'}>
            <NextLink href={'/'}>
              <Link
                style={{
                  textDecoration: 'none',
                  fontSize: '1.6em',
                  fontWeight: 'bold',
                }}
              >
                Shitpost
              </Link>
            </NextLink>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              aria-label='Toggle Color Mode'
              onClick={toggleColorMode}
              mr={2}
              _focus={{ boxShadow: 'none', outline: 'none' }}
              w='fit-content'
            >
              {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
            </Button>
            <Menu>
              <NextLink href={'/login'}>
                <Button
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  as={Link}
                  bg={'blue.400'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Login
                </Button>
              </NextLink>
              <MenuList>
                <MenuItem>Create Post</MenuItem>
                <MenuItem>logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
/** 
          
          
          
          */
