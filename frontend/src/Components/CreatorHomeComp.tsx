import { useRecoilValue } from "recoil";
import useCreatorHome from "../Hooks/useCreatorHome";
import { creatorAtom } from "../utils/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CourseCard } from "./CourseCard";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const CreatorHomeComp = () => {
	const {
		desc,
		handleDescChange,
		handleImageUrlChange,
		handleNameChange,
		handlePriceChange,
		handleCreateCourse,
		imageUrl,
		name,
		price,
	} = useCreatorHome();
	const { courses: creatorCourses, name: creatorName } =
		useRecoilValue(creatorAtom);

	const courses = useMemo(() => creatorCourses.slice(0, 3), [creatorCourses]);

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Welcome back, {creatorName}</h1>
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Your Courses</h2>

					<div className="space-x-5">
						<span className="text-sm text-gray-500">
							{courses.length} {courses.length === 1 ? "course" : "courses"}
						</span>
						<Link
							className="font-medium border rounded-3xl py-2 px-4 hover:bg-slate-200 duration-150"
							to={`/creator/courses`}
						>
							View all courses ➡️
						</Link>
					</div>
				</div>

				{courses.length === 0 ? (
					<Card>
						<CardContent className="p-6">
							<p className="text-center text-gray-500">
								You haven't created any courses yet. Use the form below to
								create your first course!
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{courses.map((course) => (
							<div
								key={course.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CourseCard
									buttonText="View Details"
									id={course.id}
									imageUrl={course.imageUrl}
									price={course.price}
									title={course.name}
								/>
							</div>
						))}
					</div>
				)}
			</div>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Course</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleCreateCourse}>
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Course Name
							</label>
							<Input
								id="name"
								placeholder="Java Course"
								value={name}
								onChange={handleNameChange}
								className="w-full"
							/>
						</div>

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
								value={imageUrl}
								onChange={handleImageUrlChange}
								className="w-full"
								placeholder="https://example.com/course-image.jpg"
							/>
						</div>

						<Button type="submit" className="w-full">
							Create Course
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorHomeComp;
