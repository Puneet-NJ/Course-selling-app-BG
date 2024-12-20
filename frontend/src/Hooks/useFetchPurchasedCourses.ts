import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { purchasesAtom } from "../utils/atoms";

const usePurchasedCourses = () => {
	const setPurchases = useSetRecoilState(purchasesAtom);

	const mutation = useMutation({
		mutationFn: () =>
			axios({
				method: "GET",
				url: `${BACKEND_URL}/user/purchases`,
				withCredentials: true,
			}),

		onSuccess: (response) => {
			setPurchases(response.data.purchases);
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, []);
};

export default usePurchasedCourses;
