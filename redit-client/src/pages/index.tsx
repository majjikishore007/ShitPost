import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClinet";
const Index = () => <NavBar></NavBar>;

export default withUrqlClient(createUrqlClient)(Index);
