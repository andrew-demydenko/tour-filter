import { Header } from "./layout/Header";
import { Content } from "./layout/Content";

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Content />
    </div>
  );
}

export default App;
