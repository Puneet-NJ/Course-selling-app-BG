import { contentAtom } from "@/utils/atoms";
import { BACKEND_URL } from "@/utils/lib";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const useContent = () => {
	const params = useParams();
	const courseId = params.courseId;
	const folderId = params.folderId;
	const contentId = params.contentId;

	const setContentAtom = useSetRecoilState(contentAtom);

	const fetchPurchasedCourseContent = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/course/${courseId}/${contentId}`,
			withCredentials: true,
		});
		const content = response.data.content;

		setContentAtom(content);
	}, []);

	useEffect(() => {
		fetchPurchasedCourseContent();
	}, [fetchPurchasedCourseContent]);

	return {
		folderId,
		contentId,
	};
};

export default useContent;
