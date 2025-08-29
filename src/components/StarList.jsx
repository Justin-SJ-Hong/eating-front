import Restaurant from "./Restaurant";

export default function StarList() {
    const items = Array.from({ length: 5 }, (_, i) => i); // 예시 데이터

    return (
        <div className="bg-white flex flex-col justify-center p-3">
            <h1 className="text-6xl flex justify-center mt-3! mb-3">찜한 맛집</h1>
            <div className="overflow-hidden items-center m-auto">
                <div className="grid grid-cols-5 items-center gap-15">
                    {items.map((id) => (
                        <div key={id} className="shrink-0">
                            <Restaurant />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}