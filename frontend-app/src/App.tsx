import { Grid } from "./components/Grid";
import { GridProvider } from "./context/GridContext";

export const App = () => {
  return (
    <div>
			<GridProvider>
				<Grid />
			</GridProvider>
    </div>
  )
}

export default App;