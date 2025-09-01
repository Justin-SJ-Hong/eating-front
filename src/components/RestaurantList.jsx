import Restaurant from "./Restaurant";
import { useEffect, useState } from "react";
import axios from "axios";
import { sortPlacesByDistance } from "../lib/loc";

export default function RestaurantList() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        let ignore = false;

        const getCurrentPosition = () =>
            new Promise((resolve, reject) => {
                if (!("geolocation" in navigator)) {
                    reject(new Error("Geolocation not supported"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) =>
                        resolve({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        }),
                    (err) => reject(err),
                    { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
                );
            });

        async function fetchPlaces() {
            try {
                let coords = null;
                try {
                    coords = await getCurrentPosition();
                    if (!ignore && coords) {
                        setLatitude(coords.lat);
                        setLongitude(coords.lon);
                    }
                } catch (e) {
                    console.error(e?.message || e);
                    if (!ignore) setLocationError("위치를 불러오지 못했습니다.");
                }

                const res = await axios.get("http://localhost:3000/places");
                // 서버 응답: { places: [...] }
                console.log(res.data);

                const list = res.data?.places ?? [];

                const withGeo = list.filter(
                    (p) => typeof p.lat === "number" && typeof p.lon === "number"
                );
                const withoutGeo = list.filter(
                    (p) => !(typeof p.lat === "number" && typeof p.lon === "number")
                );

                let ordered = withGeo;

                if (coords) {
                    // 가까운 순 정렬
                    ordered = sortPlacesByDistance(withGeo, coords.lat, coords.lon);
                }

                const finalList = [...ordered, ...withoutGeo];

                if (!ignore) {
                    setPlaces(finalList);
                }
            } catch (e) {
                if(axios.isAxiosError(e)) {
                    const status = e.response?.status;

                    if(!ignore) {
                        if(status === 404) {
                            setError("요청하신 데이터를 찾을 수 없습니다. (404)");
                        } else {
                            const msg = e.message || "맛집 목록을 불러오지 못했습니다.";
                            setError(msg)
                        }
                    }
                } else {
                    if (!ignore) {
                        setError("알 수 없는 오류가 발생했습니다.");
                    }
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
                <div className="flex justify-center p-6 text-gray-500">맛집을 불러오는 중입니다...</div>
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

            {locationError && (
                <div className="m-auto mb-4 rounded bg-yellow-50 px-4 py-2 text-yellow-800">
                    {locationError}
                </div>
            )}

            {latitude !== null && longitude !== null && (
                <div className="m-auto mb-4 rounded bg-green-50 px-4 py-2 text-green-800">
                    <p>
                        현재 좌표 : <span className="font-mono">{latitude.toFixed(5)}</span>,{" "}
                        <span className="font-mono">{longitude.toFixed(5)}</span>
                    </p>
                </div>
            )}

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