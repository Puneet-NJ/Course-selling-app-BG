import { contentAtom, folderAtom } from "@/utils/atoms";
import { BACKEND_URL } from "@/utils/lib";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const useContent = () => {
	const params = useParams();
	const courseId = params.courseId;
	const folderId = params.folderId;
	const contentId = params.contentId;

	const [videoUrl, setVideoUrl] = useState("");

	const setContentAtom = useSetRecoilState(contentAtom);
	const setFolderAtom = useSetRecoilState(folderAtom);

	const fetchPurchasedCourseContent = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/course/${courseId}/${contentId}`,
			withCredentials: true,
		});
		const content = response.data.content;
		const signedContentUrl = response.data.signedUrl;
		const folder = response.data.folder;

		setContentAtom(content);
		setFolderAtom(folder);
		setVideoUrl(signedContentUrl);
	}, []);

	useEffect(() => {
		fetchPurchasedCourseContent();
	}, [fetchPurchasedCourseContent]);

	return {
		folderId,
		contentId,
		videoUrl,
	};
};

export default useContent;
