import './App.css'
import StarList from './components/StarList'
import RestaurantList from "./components/RestaurantList.jsx";
import {FavoritesProvider} from "./components/FavoritesContext.jsx";

function App() {
    return (
        <>
            <div className="flex flex-col gap-10 p-12">
                <FavoritesProvider>
                    <StarList />
                    <RestaurantList />
                </FavoritesProvider>
            </div>
        </>
    )
}

export default App
