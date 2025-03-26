import PageHeader from "../components/common/pageHeader";
import Logo from "../components/logo";
import CardPage from "../components/cards/cardPage";
import isNightMode from "../components/navbar";

function Home(props) {
  return (
    <div className="container">
      <PageHeader
        title={<Logo isNightMode={isNightMode} className="text-black" />}
        description="Why you should use real app"
      />
      <CardPage searchValue={props.searchValue} />
    </div>
  );
}

export default Home;
