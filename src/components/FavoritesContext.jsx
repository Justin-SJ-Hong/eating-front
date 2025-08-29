import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [errorFavorites, setErrorFavorites] = useState(null);

  const refreshFavorites = useCallback(async () => {
    try {
      setLoadingFavorites(true);
      setErrorFavorites(null);
      const res = await axios.get("http://localhost:3000/users/places");
      setFavorites(res.data?.places ?? []);
    } catch (e) {
      setErrorFavorites(e?.message ?? "찜 목록을 불러오지 못했습니다.");
    } finally {
      setLoadingFavorites(false);
    }
  }, []);

  useEffect(() => {
    // 앱 시작 시 한 번 로드
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loadingFavorites, errorFavorites, refreshFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites는 FavoritesProvider 내부에서만 사용하세요.");
  return ctx;
}