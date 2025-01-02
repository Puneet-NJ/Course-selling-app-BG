import axios from "axios";
import { useCallback, useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { creatorAtom } from "../utils/atoms";
import { useState } from "react";

const useCreatorHome = () => {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [price, setPrice] = useState(0);
	const [imageUrl, setImageUrl] = useState<File | null>(null);
	const setCreatorData = useSetRecoilState(creatorAtom);

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
		if (!e.target.files?.[0]) return;

		setImageUrl(e.target.files[0]);
	};

	const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			// Send the form data & Get Pre-signed URL from the backend
			const signedUrlResponse = await axios({
				method: "POST",
				url: `${BACKEND_URL}/course/`,
				withCredentials: true,
				data: { name, description: desc, price },
			});
			const { signedUrl, courseId } = signedUrlResponse.data;

			// Put the image in S3

			const s3Response = await axios({
				method: "PUT",
				url: `${signedUrl}`,
				data: imageUrl,
				headers: { "Content-Type": "image/png" },
			});
			if (s3Response.status !== 200) return;

			// Send confirmation to backend
			const backendUpdateResponse = await axios({
				method: "POST",
				url: `${BACKEND_URL}/course/uploadSuccess/${courseId}`,
				withCredentials: true,
			});
			if (backendUpdateResponse.status !== 200) return;
		} catch (err) {
			console.log("Error while putting the data in db or s3 ", err);
		}

		fetchCourses();

		setName("");
		setDesc("");
		setPrice(0);
		setImageUrl(null);
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
