import useCreatorCourseComp from "@/Hooks/useCreatorCourseComp";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Delete } from "@/utils/Icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { Plus, Video, Folder } from "lucide-react";

const CreatorCourseComp = () => {
	const {
		desc,
		price,
		folderName,
		courseContent,
		videoName,
		setVideoName,
		setVideo,
		setFolderName,
		handleDescChange,
		handleImageUrlChange,
		handlePriceChange,
		handleEditCourse,
		handleCourseDelete,
		handleAddFolder,
		handleVideoAdd,
	} = useCreatorCourseComp();

	return (
		<div className="max-w-6xl mx-auto my-8 space-y-20">
			<Card className="">
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
								Image
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

			<Card>
				<CardHeader>
					<CardTitle className="px-2 text-2xl flex justify-between">
						<span>Course Content</span>{" "}
						<div className="flex gap-5">
							<Input
								placeholder="Folder-1"
								value={folderName}
								onChange={(e) => {
									setFolderName(e.target.value);
								}}
								className="font-normal"
							/>

							<Button
								className={
									"font-semibold bg-green-600 " +
									(folderName === ""
										? "cursor-not-allowed opacity-50"
										: "hover:bg-lime-500")
								}
								onClick={handleAddFolder}
							>
								<Plus className="h-4 w-4" />
								Add Folder
							</Button>
						</div>
					</CardTitle>
				</CardHeader>

				<CardContent className="p-6">
					<Accordion type="multiple" className="w-full space-y-4">
						{courseContent?.map((folder, index) => (
							<AccordionItem
								value={folder.id}
								key={folder.id}
								className="border rounded-lg bg-white shadow-sm"
							>
								<AccordionTrigger className="px-4 py-3 hover:no-underline">
									<div className="flex items-center gap-3">
										<Folder className="h-5 w-5 text-blue-600" />
										<span className="text-lg font-semibold">{folder.name}</span>
									</div>
								</AccordionTrigger>

								<AccordionContent className="px-4 pb-4">
									<div className="space-y-3">
										{folder.courseContents.map((content) => (
											<div
												key={content.id}
												className="flex items-center justify-between p-3 rounded-md bg-gray-100 hover:bg-gray-100 transition-colors"
											>
												<div className="flex items-center gap-3">
													<Video className="h-4 w-4 text-gray-600" />
													<span className="font-medium">{content.name}</span>
												</div>
											</div>
										))}

										<div className="flex items-center gap-5">
											<Input
												value={videoName?.get(index)}
												onChange={(e) => {
													setVideoName((prev) => {
														return prev?.set(index, e.target.value);
													});
												}}
												placeholder="Video-1"
											/>
											<Input
												type="file"
												accept="video/mp4"
												onChange={(e) => {
													if (!e.target.files?.[0]) return;

													setVideo(e.target.files[0]);
												}}
											/>
											<Button
												className="flex items-center justify-center gap-2"
												onClick={() => {
													handleVideoAdd(videoName?.get(index), folder.id);
												}}
											>
												<Plus className="h-4 w-4" />
												Add Video
											</Button>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorCourseComp;
