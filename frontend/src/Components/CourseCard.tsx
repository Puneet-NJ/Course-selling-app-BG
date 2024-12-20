import { Link } from "react-router-dom";

type Props = {
	id: string;
	imageUrl: string;
	title: string;
	price: number;
	buttonText: string;
};

export const CourseCard = ({
	id,
	imageUrl,
	title,
	price,
	buttonText,
}: Props) => {
	return (
		<div className="border w-72 shadow-lg rounded-lg">
			<div className="h-[160px]">
				<img className="rounded-t-lg" src={imageUrl} />
			</div>

			<div className="py-[5%] px-[7%] flex flex-col h-[190px] justify-between">
				<h3 className="font-semibold text-lg">{title}</h3>

				<div className="space-y-3">
					<div className="font-semibold">₹{price}</div>

					<button className="w-full py-3 bg-blue-600 text-white rounded-3xl">
						<Link to={`/course/${id}`}>{buttonText}</Link>
					</button>
				</div>
			</div>
		</div>
	);
};
