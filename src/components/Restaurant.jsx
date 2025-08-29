import axios from "axios";
import { useFavorites } from "./FavoritesContext";

export default function Restaurant({ id, name, imageUrl, image, onRemove }) {
    const { refreshFavorites } = useFavorites();

    async function handleLike() {
        try {
            await axios.post("http://localhost:3000/users/places", {
                place: {
                    id,
                    name,
                    image, // 서버에는 원본 경로 저장 (예: images/xxx.jpg)
                },
            });
            await refreshFavorites(); // POST 성공 후 최신 찜 목록으로 갱신
        } catch (e) {
            console.error("찜 처리 중 오류:", e);
        }
    }

    return (
        <div className="m-3! h-36 w-36 bg-gray-200 rounded shadow overflow-hidden flex flex-col items-center justify-start relative" onClick={handleLike}>
            <div className="w-full h-28 bg-gray-300 flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : null}
            </div>
            <div className="w-full px-2 py-1 text-sm text-center truncate">
                {name || ""}
            </div>
            {/* StarList에서만 전달되는 onRemove가 있을 때만 삭제 버튼 노출 */}
            {typeof onRemove === "function" ? (
                <button
                    type="button"
                    className="absolute -top-0 -right-0 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(id);
                    }}
                    aria-label={`${name} 삭제`}
                    title="삭제"
                >
                    삭제
                </button>
            ) : null}
        </div>
    );
}