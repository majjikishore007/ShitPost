import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { ReactNode } from 'react';
import { BsMoonStarsFill, BsSun } from 'react-icons/bs';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');
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
