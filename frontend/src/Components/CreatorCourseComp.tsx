import useCreatorCourseComp from "@/Hooks/useCreatorCourseComp";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Delete } from "@/utils/Icons";

const CreatorCourseComp = () => {
	const {
		desc,
		price,
		handleDescChange,
		handleImageUrlChange,
		handlePriceChange,
		handleEditCourse,
		handleCourseDelete,
	} = useCreatorCourseComp();

	return (
		<div>
			<Card className="max-w-6xl mx-auto mt-8">
				<CardHeader className="">
					<CardTitle className="px-2 text-2xl flex justify-between">
						<span>Edit This Course</span>{" "}
						<button
							onClick={handleCourseDelete}
							className="p-2 rounded-full hover:text-red-500 hover:bg-black duration-150"
						>
							<Delete />
						</button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleEditCourse}>
						<div className="space-y-2">
							<label htmlFor="desc" className="text-sm font-medium">
								Course Description
							</label>
							<Textarea
								id="desc"
								placeholder="Enter course description..."
								value={desc}
								onChange={handleDescChange}
								className="w-full min-h-[100px]"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="price" className="text-sm font-medium">
								Price
							</label>
							<Input
								id="price"
								type="number"
								value={price}
								onChange={handlePriceChange}
								className="w-full"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="image" className="text-sm font-medium">
								Image URL
							</label>
							<Input
								id="image"
								type="file"
								accept="image/*"
								onChange={handleImageUrlChange}
								className="w-full"
							/>
						</div>

						<Button type="submit" className="w-full">
							Edit Course
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorCourseComp;
