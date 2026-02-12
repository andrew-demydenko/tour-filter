import { Header } from "./layouts/Header";
import { Content } from "./layouts/Content";

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Content />
    </div>
  );
}

export default App;
