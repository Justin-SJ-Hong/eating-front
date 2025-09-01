import Restaurant from "./Restaurant";
import {useFavorites} from "./FavoritesContext";
import axios from "axios";

export default function StarList() {
    const { favorites, loadingFavorites, errorFavorites, refreshFavorites} = useFavorites();

    async function handleRemove(id) {
        try {
            await axios.delete(`http://localhost:3000/users/places/${id}`);
            await refreshFavorites();
        } catch (e) {
            console.error("삭제 중 오류:", e);
        }
    }

    if (loadingFavorites) {
        return (
            <div className="bg-white flex flex-col justify-center p-3">
                <h1 className="text-6xl flex justify-center mt-3! mb-3">찜한 맛집</h1>
                <div className="flex justify-center p-6 text-gray-500">맛집을 불러오는 중입니다...</div>
            </div>
        );
    }

    if (errorFavorites) {
        return (
            <div className="bg-white flex flex-col justify-center p-3">
                <h1 className="text-6xl flex justify-center mt-3! mb-3">찜한 맛집</h1>
                <div className="flex justify-center p-6 text-red-500">에러: {errorFavorites}</div>
            </div>
        );
    }

    return (
        <div className="bg-white flex flex-col justify-center p-3">
            <h1 className="text-6xl flex justify-center mt-3! mb-3">찜한 맛집</h1>
            <div className="overflow-hidden items-center m-auto">
                <div className="grid grid-cols-5 items-center gap-15">
                    {favorites.map((p) => {
                        const name = p.name ?? p.title ?? "이름 없음";
                        const imageUrl = p?.image
                            ? new URL(p.image, "http://localhost:3000/").toString()
                            : undefined;
                        return (
                            <div key={p.id} className="shrink-0">
                                <Restaurant
                                    id={p.id}
                                    name={name}
                                    imageUrl={imageUrl}
                                    image={p.image}
                                    onRemove={handleRemove} // StarList에서만 삭제 콜백 전달
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}