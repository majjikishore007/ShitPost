import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bg='tomato'>
      <Box ml={"auto"} p='4'>
        <NextLink href='/login'>
          <Link p='2' mx={2}>
            login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link p='2'>register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
