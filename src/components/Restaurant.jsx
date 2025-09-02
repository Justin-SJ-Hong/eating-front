import axios from "axios";
import { useFavorites } from "./FavoritesContext";

export default function Restaurant({ id, name, imageUrl, image, onRemove }) {
    const { refreshFavorites } = useFavorites();

    async function handleLike() {
        try {
            const res = await axios.post("http://localhost:3000/users/places", {
                place: {
                    id,
                    name,
                    image, // 서버에는 원본 경로 저장 (예: images/xxx.jpg)
                },
            });
            // 응답 성공 여부 확인: 2xx 상태 + (선택) 서버에서 success 플래그를 내려주는 경우 함께 확인
            const isHttpOk = res.status >= 200 && res.status < 300;
            const hasSuccessFlag = res.data && typeof res.data.success !== "undefined";
            const isSuccess = hasSuccessFlag ? Boolean(res.data.success) : isHttpOk;

            if (isSuccess) {
                alert("찜 처리에 성공했습니다.");
                await refreshFavorites(); // 성공 시 최신 찜 목록으로 갱신
            } else {
                console.error("찜 처리 실패: 서버가 실패를 반환했습니다.", {
                    status: res.status,
                    data: res.data,
                });
                // 필요 시 사용자 알림 추가 가능
                alert("찜 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }

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