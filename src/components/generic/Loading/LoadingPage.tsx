import Paper from "@/components/elements/Paper/Paper";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";

const LoadingPage = () => (
  <PageBody>
    <PageRow>
      <PageColumn>
        <Paper>
          <Loader />
        </Paper>
      </PageColumn>
    </PageRow>
  </PageBody>
);

export default LoadingPage;
