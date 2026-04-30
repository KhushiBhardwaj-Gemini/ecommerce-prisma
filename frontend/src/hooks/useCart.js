import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";

const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await API.get("/cart");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false,
  });
};

export default useCart;