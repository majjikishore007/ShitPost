import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  console.log("data ", data);

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
        <Button
          variant={"link"}
          isLoading={logoutFetching}
          onClick={() => {
            logout();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position={'sticky'} top={'0'} zIndex={1} bg={'skyblue'}>
      <Box ml={'auto'} p={6}>
        {body}
      </Box>
    </Flex>
  );
};
