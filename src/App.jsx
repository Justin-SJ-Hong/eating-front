import './App.css'
import StarList from './components/StarList'
import RestaurantList from "./components/RestaurantList.js";

function App() {
    return (
        <>
            <div className="flex flex-col gap-10 p-12">
                <StarList />
                <RestaurantList />
            </div>
        </>
    )
}

export default App
