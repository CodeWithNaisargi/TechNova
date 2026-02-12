
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { PlayCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Lesson {
    id: string;
    title: string;
    duration?: number | null;
    isFree: boolean;
    type?: string; // VIDEO, QUIZ, ASSIGNMENT
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
    order: number;
}

interface CourseCurriculumProps {
    sections: Section[];
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ sections }) => {
    // Calculate total lectures and duration
    const totalLectures = sections.reduce((acc, section) => acc + section.lessons.length, 0);
    const totalDuration = sections.reduce((acc, section) =>
        acc + section.lessons.reduce((lAcc, lesson) => lAcc + (lesson.duration || 0), 0), 0
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Course Content</h3>
                <div className="text-sm text-slate-500">
                    {sections.length} sections • {totalLectures} lectures • {Math.round(totalDuration / 60)}h {totalDuration % 60}m total length
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full border rounded-lg bg-white shadow-sm">
                {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} className="last:border-b-0">
                        <AccordionTrigger className="px-6 hover:bg-slate-50">
                            <div className="flex flex-col text-left">
                                <span className="font-semibold text-slate-800">{section.title}</span>
                                <span className="text-xs text-slate-500 font-normal mt-1">
                                    {section.lessons.length} lectures • {Math.round(section.lessons.reduce((acc, l) => acc + (l.duration || 0), 0))} min
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-slate-50/50">
                            <div className="divide-y divide-slate-100">
                                {section.lessons.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between py-3 px-6 hover:bg-slate-100/80 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {lesson.type === 'QUIZ' ? (
                                                <FileText className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <PlayCircle className="w-4 h-4 text-slate-400" />
                                            )}
                                            <span className="text-sm text-slate-700">{lesson.title}</span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {lesson.isFree && (
                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Preview</Badge>
                                            )}
                                            <span className="text-xs text-slate-500 w-12 text-right">
                                                {lesson.duration ? `${lesson.duration}m` : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default CourseCurriculum;
