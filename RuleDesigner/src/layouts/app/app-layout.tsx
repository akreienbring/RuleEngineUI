import Main from "./main";
import Header from "./header";
import Container from "@mui/material/Container";
import RuleDesigner from "@src/pages/rule-designer";

// ----------------------------------------------------------------------
/**
 * The layout of the application with the nav bar, the header and
 * the different pages
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns
 */
export default function AppLayout() {
  return (
    <>
      <Header />

      <Main>
        <Container maxWidth="xl">
          <RuleDesigner />
        </Container>
      </Main>
    </>
  );
}
