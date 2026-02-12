import { Header } from "./layout/header";
import { Content } from "./layout/content";

function App() {
  return (
    <div className="container mx-auto max-w-[1200px] flex flex-col h-full">
      <Header />
      <Content />
    </div>
  );
}

export default App;
