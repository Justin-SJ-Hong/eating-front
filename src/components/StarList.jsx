import Restaurant from "./Restaurant";
import {useFavorites} from "./FavoritesContext";
import axios from "axios";
import { useState } from "react";

export default function StarList() {
    const { favorites, loadingFavorites, errorFavorites, refreshFavorites} = useFavorites();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [id, setId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    function handleRemove(id) {
        setDeleteError(null);
        setId(id);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!id) return;
        try {
            setDeleting(true);
            setDeleteError(null);
            await axios.delete(`http://localhost:3000/users/places/${id}`);
            await refreshFavorites();
            setConfirmOpen(false);
            setId(null);
        } catch (e) {
            console.error("삭제 중 오류:", e);
            setDeleteError("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setDeleting(false);
        }
    }

    function cancelDelete() {
        if (deleting) return;
        setConfirmOpen(false);
        setId(null);
        setDeleteError(null);
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
            {confirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-confirm-title"
                        className="bg-white rounded shadow-lg p-6 w-[320px]"
                    >
                        <h2 id="delete-confirm-title" className="text-lg font-semibold mb-2">삭제 확인</h2>
                        <p className="text-sm text-gray-700 mb-4">정말 삭제하시겠어요?</p>
                        {deleteError ? (
                            <div className="mb-3 text-xs text-red-600">{deleteError}</div>
                        ) : null}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-3 py-1 rounded border border-gray-300 text-gray-700"
                                onClick={cancelDelete}
                                disabled={deleting}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "삭제 중..." : "삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}