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
	const [name, setName] = useState("");
	const [imageUrl, setImageUrl] = useState<File | null>(null);
	const [folderName, setFolderName] = useState("");
	const [courseContent, setCourseContent] = useState<
		| ({
				courseContents: {
					id: string;
					name: string;
					isUploaded: boolean;
					courseFolderId: string;
				}[];
		  } & {
				courseId: string;
				id: string;
				name: string;
		  })[]
		| null
	>(null);
	const [video, setVideo] = useState<File | null>(null);
	const [videoName, setVideoName] = useState<Map<number, string>>(new Map());

	const setCourseAtom = useSetRecoilState(courseAtom);
	const params = useParams();
	const navigate = useNavigate();

	const courseId = params.courseId;

	const deleteCourseMutation = useMutation({
		mutationFn: () =>
			axios({
				method: "DELETE",
				url: `${BACKEND_URL}/course/${courseId}`,
				withCredentials: true,
			}),

		onSuccess: () => {
			navigate("/creator");
		},
	});

	const addFolderMutation = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/course/createFolder`,
				data: {
					name: folderName,
					courseId: courseId,
				},
				withCredentials: true,
			}),

		onSuccess: () => {
			fetchCourse();
		},
	});

	const fetchCourse = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/course/${courseId}`,
			withCredentials: true,
		});

		const data = response.data;

		setCourseContent(data.course.courseFolders);

		setCourseAtom(data.course);

		setName(data.course.name);
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
					courseId: courseId || "",
				},
				withCredentials: true,
			});
			const { signedUrl } = updateResponse.data;

			const s3Response = await axios({
				method: "PUT",
				url: signedUrl,
				data: imageUrl,
				headers: { "Content-Type": "image/png" },
			});
			if (s3Response.status !== 200) return;

			const backendUpdateResponse = await axios({
				method: "POST",
				url: `${BACKEND_URL}/course/uploadSuccess/${courseId}`,
				withCredentials: true,
			});
			if (backendUpdateResponse.status !== 200) return;
		} catch (err) {
			console.log(err);
		}

		fetchCourse();
	};

	const handleCourseDelete = () => {
		deleteCourseMutation.mutate();
	};

	const handleAddFolder = () => {
		if (folderName === "") return;

		addFolderMutation.mutate();
	};

	const handleVideoAdd = async (
		videoName: string | undefined,
		folderId: string
	) => {
		if (!videoName || videoName === "" || video === null) return;

		try {
			const postResponse = await axios({
				method: "POST",
				url: `${BACKEND_URL}/course/postContent`,
				data: { name: videoName, folderId: folderId },
				withCredentials: true,
			});
			const { signedUrl } = postResponse.data;

			const s3Response = await axios({
				method: "PUT",
				url: `${signedUrl}`,
				data: video,
				headers: { "Content-Type": "video/mp4" },
			});
			if (s3Response.status !== 200) return;
		} catch (err) {
			console.log(err);
		}

		setVideoName(new Map());
		setVideo(null);

		fetchCourse();
	};

	const handleDeleteVideo = async (contentId: string) => {
		try {
			await axios({
				method: "DELETE",
				url: `${BACKEND_URL}/course/content/${contentId}`,
				withCredentials: true,
			});

			fetchCourse();
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeleteFolder = async (folderId: string, index: number) => {
		try {
			await axios({
				method: "DELETE",
				url: `${BACKEND_URL}/course/folder/${folderId}`,
				withCredentials: true,
			});

			fetchCourse();

			const newMap = new Map(videoName);
			newMap.delete(index);

			setVideoName(newMap);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		name,
		desc,
		price,
		imageUrl,
		folderName,
		courseContent,
		videoName,
		setVideoName,
		setVideo,
		setFolderName,
		navigate,
		handleDescChange,
		handlePriceChange,
		handleImageUrlChange,
		handleEditCourse,
		handleCourseDelete,
		handleAddFolder,
		handleVideoAdd,
		handleDeleteVideo,
		handleDeleteFolder,
	};
};

export default useCreatorCourseComp;
