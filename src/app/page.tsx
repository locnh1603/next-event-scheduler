import NavBar from "@/components/navbar";
import Loading from "@/components/loading";
import {Box} from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ height: '100%', width: "100%" }}>
      <NavBar></NavBar>
      <Loading></Loading>
    </Box>
  );
}
