import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClinet";
import { usePostsQuery } from "../generated/graphql";
import { Box } from "@chakra-ui/react";
const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar></NavBar>
      <Box m={"auto"} width='80%'>
        {!data
          ? null
          : data.posts.map((post) => <div key={post.id}>{post.title}</div>)}
      </Box>
    </>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
