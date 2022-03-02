import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href={"/login"}>
          <Link color='black' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href={"/register"}>
          <Link color='black' mr={2}>
            Signup
          </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant={"link"}>logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg={"skyblue"}>
      <Box ml={"auto"} p={6}>
        {body}
      </Box>
    </Flex>
  );
};
