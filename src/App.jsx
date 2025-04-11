import "./App.css";
import DragDropTables from "./components/DragDropTables";

function App() {
  return (
    <>
      <h1>Tables with drag-n-drop rows</h1>
      <p>You can drag lines from the right table and drop them into the left table. The item ids will be collected in the right table.</p>
      <DragDropTables />
    </>
  );
}

export default App;
