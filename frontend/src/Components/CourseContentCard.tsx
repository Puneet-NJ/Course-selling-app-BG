const CourseContentCard = ({
	imageUrl,
	price,
	onPurchase,
}: {
	imageUrl: string;
	price: number;
	onPurchase: () => void;
}) => {
	return (
		<div className="border w-72 shadow-lg rounded-lg">
			<div className="h-[160px]">
				<img className="rounded-t-lg" src={imageUrl} />
			</div>

			<div className="py-[5%] px-[7%] flex flex-col h-[130px] justify-between bg-blue-100">
				<div className="space-y-3">
					<div>
						<div className="text-gray-500 text-sm">PRICE</div>
						<div className="font-semibold text-lg">₹{price}</div>
					</div>

					<button
						className="w-full py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 duration-150"
						onClick={onPurchase}
					>
						Buy now
					</button>
				</div>
			</div>
		</div>
	);
};

export default CourseContentCard;
