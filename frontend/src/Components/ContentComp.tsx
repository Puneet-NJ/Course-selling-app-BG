import useContent from "@/Hooks/useContent";
import { contentAtom } from "@/utils/atoms";
import { useRecoilValue } from "recoil";
import VideoJS from "./VideoJS";
// import Player from "video.js/dist/types/player";

export const ContentComp = () => {
	useContent();
	const content = useRecoilValue(contentAtom);

	console.log(content.contentUrl);

	// const handlePlayerReady = (player: Player) => {
	// 	// You can handle player events here, for example:
	// 	player.on("waiting", () => {
	// 		videojs.log("player is waiting");
	// 	});

	// 	player.on("dispose", () => {
	// 		videojs.log("player will dispose");
	// 	});
	// };

	if (content.contentUrl === "") return <>loading...</>;
	return (
		<div className="w-full">
			<VideoJS
				options={{
					autoplay: true,
					controls: true,
					responsive: true,
					fluid: true,
					sources: [
						{
							src: `${content.contentUrl}`,
							type: "video/mp4",
						},
					],
				}}
				// onReady={handlePlayerReady}
			/>
		</div>
	);
};
