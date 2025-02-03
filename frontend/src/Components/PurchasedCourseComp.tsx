import usePurchasedCourse from "@/Hooks/usePurchasedCourse";
import { purchasedCourseAtom } from "@/utils/atoms";
import { useRecoilValue } from "recoil";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { Folder, Video } from "lucide-react";
import { Link } from "react-router-dom";

export function PurchasedCourseComp() {
	usePurchasedCourse();
	const course = useRecoilValue(purchasedCourseAtom);

	return (
		<div className="space-y-8">
			<div className="border-b">
				<h1 className="text-2xl font-semibold py-2">{course.name}</h1>
			</div>

			<div>
				<Accordion type="multiple" className="w-full space-y-4">
					{course.courseFolders?.map((folder) => (
						<AccordionItem
							value={folder.id}
							key={folder.id}
							className="border rounded-lg bg-white shadow-sm"
						>
							<AccordionTrigger className="px-4 py-3 hover:no-underline border-b">
								<div className="flex items-center gap-3">
									<Folder className="h-5 w-5 text-blue-600" />
									<span className="text-lg font-semibold">{folder.name}</span>
								</div>
							</AccordionTrigger>

							<AccordionContent className="px-4 pb-4 py-2">
								<div className="space-y-3">
									{folder.courseContents.map((content) => (
										<Link
											key={content.id}
											to={`/purchased/${course.id}/${folder.id}/${content.id}`}
										>
											<div className="flex items-center justify-between p-3 rounded-md bg-gray-100 hover:bg-gray-100 transition-colors">
												<div className="flex items-center gap-3">
													<Video className="h-4 w-4 text-gray-600"></Video>
													<span className="font-medium">{content.name}</span>
												</div>
											</div>
										</Link>
									))}{" "}
									<div className="font-semibold text-center">
										{folder.courseContents.length === 0
											? "No Content Uploaded"
											: ""}
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
