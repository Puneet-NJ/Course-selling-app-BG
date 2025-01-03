import { courseAtom } from "@/utils/atoms";
import { BACKEND_URL } from "@/utils/lib";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const useCreatorCourseComp = () => {
	const [desc, setDesc] = useState("");
	const [price, setPrice] = useState(0);
	const [imageUrl, setImageUrl] = useState<File | null>(null);
	const setCourseAtom = useSetRecoilState(courseAtom);
	const params = useParams();
	const navigate = useNavigate();

	const deleteCourseMutation = useMutation({
		mutationFn: () =>
			axios({
				method: "DELETE",
				url: `${BACKEND_URL}/course/${params.courseId}`,
				withCredentials: true,
			}),

		onSuccess: () => {
			navigate("/creator");
		},
	});

	const fetchCourse = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/course/${params.courseId}`,
			withCredentials: true,
		});

		const data = response.data;

		setCourseAtom(data.course);

		setDesc(data.course.description);
		setPrice(data.course.price);
		setImageUrl(data.course.imageUrl);
	}, [setCourseAtom, params]);

	useEffect(() => {
		fetchCourse();
	}, [fetchCourse]);

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

	const handleEditCourse = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const updateResponse = await axios({
				method: "PUT",
				url: `${BACKEND_URL}/course`,
				data: {
					description: desc,
					price,
					courseId: params.courseId || "",
				},
				withCredentials: true,
			});
			const { signedUrl, courseId } = updateResponse.data;

			const s3Response = await axios({
				method: "PUT",
				url: signedUrl,
				data: imageUrl,
				headers: { "Content-Type": "image/png" },
			});
			if (s3Response.status !== 200) return;

			await axios({
				method: "POST",
				url: `${BACKEND_URL}/course/uploadSuccess/${courseId}`,
				withCredentials: true,
			});
		} catch (err) {
			console.log(err);
		}

		fetchCourse();
	};

	const handleCourseDelete = () => {
		deleteCourseMutation.mutate();
	};

	return {
		desc,
		price,
		imageUrl,
		handleDescChange,
		handlePriceChange,
		handleImageUrlChange,
		handleEditCourse,
		handleCourseDelete,
	};
};

export default useCreatorCourseComp;
