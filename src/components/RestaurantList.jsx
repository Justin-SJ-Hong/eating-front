import Restaurant from "./Restaurant";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantList() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function fetchPlaces() {
            try {
                const res = await axios.get("http://localhost:3000/places");
                // 서버 응답: { places: [...] }
                console.log(res.data);
                const list = res.data?.places ?? [];
                if (!ignore) {
                    setPlaces(list);
                }
            } catch (e) {
                if (!ignore) {
                    setError(e?.message ?? "불러오기에 실패했습니다.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchPlaces();
        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-white flex flex-col justify-center p-3">
                <h1 className="text-6xl flex justify-center mt-3! mb-3">맛집 목록</h1>
                <div className="flex justify-center p-6 text-gray-500">불러오는 중…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white flex flex-col justify-center p-3">
                <h1 className="text-6xl flex justify-center mt-3! mb-3">맛집 목록</h1>
                <div className="flex justify-center p-6 text-red-500">에러: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white flex flex-col justify-center p-3">
            <h1 className="text-6xl flex justify-center mt-3! mb-3">맛집 목록</h1>
            <div className="overflow-hidden items-center m-auto">
                <div className="grid grid-cols-5 items-center gap-15">
                    {places.map((p) => {
                        const name = p.name ?? p.title ?? "이름 없음";
                        // 서버가 images 폴더를 static으로 제공하므로, 상대 경로라면 서버 호스트를 붙여 완전한 URL로 만듭니다.
                        const imageRelative = p?.image?.src ?? p?.image; // 데이터 형태 모두 대응
                        const imageUrl = imageRelative
                            ? new URL(imageRelative, "http://localhost:3000/").toString()
                            : undefined;

                        return (
                            <div key={p.id} className="shrink-0">
                                <Restaurant
                                    id={p.id}
                                    name={name}
                                    imageUrl={imageUrl}
                                    image={imageRelative}
                                />
                            </div>

                        );
                    })}
                </div>
            </div>
        </div>
    );
}