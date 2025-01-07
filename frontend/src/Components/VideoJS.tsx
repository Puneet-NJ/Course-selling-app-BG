import { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
// import VideoJsPlayerOptions from "video.js";
import "video.js/dist/video-js.css";

type VideoJSProps = {
	options: {
		autoplay: boolean;
		controls: boolean;
		responsive: boolean;
		fluid: boolean;
		sources: [
			{
				src: string;
				type: string;
			}
		];
	};
	onReady?: (player: Player) => void;
};

export const VideoJS = ({ options, onReady }: VideoJSProps) => {
	const videoRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<Player | null>(null);

	useEffect(() => {
		if (!playerRef.current && videoRef.current) {
			const videoElement = document.createElement("video-js");
			videoElement.classList.add("vjs-big-play-centered");
			videoRef.current.appendChild(videoElement);

			const player = (playerRef.current = videojs(videoElement, options, () => {
				videojs.log("player is ready");
				onReady?.(player);
			}));
		} else if (playerRef.current) {
			const player = playerRef.current;
			player.autoplay(options.autoplay || false);
			player.src(options.sources || []);
		}
	}, [options, onReady]);

	useEffect(() => {
		return () => {
			if (playerRef.current && !playerRef.current.isDisposed()) {
				playerRef.current.dispose();
				playerRef.current = null;
			}
		};
	}, []);

	return (
		<div data-vjs-player>
			<div ref={videoRef} />
		</div>
	);
};

export default VideoJS;
