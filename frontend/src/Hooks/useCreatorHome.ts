import axios from "axios";
import { useCallback, useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { creatorAtom } from "../utils/atoms";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const useCreatorHome = () => {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [price, setPrice] = useState(0);
	const [imageUrl, setImageUrl] = useState("");
	const setCreatorData = useSetRecoilState(creatorAtom);

	const createCourseMutate = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/course`,
				data: { name, description: desc, price, imageUrl },
				withCredentials: true,
			}),

		onSuccess: () => {
			fetchCourses();
		},
	});

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDesc(e.target.value);
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPrice(Number(e.target.value));
	};

	const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImageUrl(e.target.value);
	};

	const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		createCourseMutate.mutate();
	};

	const fetchCourses = useCallback(async () => {
		const reponse = await axios({
			method: "GET",
			url: `${BACKEND_URL}/admin/courses`,
			withCredentials: true,
		});
		const { name, courses } = reponse.data;
		setCreatorData({ name, courses });
	}, [setCreatorData]);

	useEffect(() => {
		fetchCourses();
	}, [fetchCourses]);

	return {
		name,
		desc,
		price,
		imageUrl,
		handleDescChange,
		handleImageUrlChange,
		handleNameChange,
		handlePriceChange,
		handleCreateCourse,
	};
};

export default useCreatorHome;
