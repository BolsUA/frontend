"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Select, { MultiValue, SingleValue } from 'react-select';

const types = [
    { value: 'research-initiation', label: 'Research Initiation' },
    { value: 'research', label: 'Research' },
];
const areas = [
    // Physical Sciences
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
  
    // Life Sciences
    { value: 'biology', label: 'Biology' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'public-health', label: 'Public Health' },
    { value: 'environmental-science', label: 'Environmental Science' },
    { value: 'ecology', label: 'Ecology' },
  
    // Engineering and Technology
    { value: 'engineering', label: 'Engineering' },
    { value: 'computer-science', label: 'Computer Science' },
  
    // Social Sciences
    { value: 'psychology', label: 'Psychology' },
    { value: 'sociology', label: 'Sociology' },
    { value: 'anthropology', label: 'Anthropology' },
  
    // Humanities
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'philosophy', label: 'Philosophy' },
  
    // Sustainability
    { value: 'sustainability', label: 'Sustainability' },
];
const jury = [
    { value: 'prof-smith', label: 'Prof. Smith' },
    { value: 'dr-johnson', label: 'Dr. Johnson' },
    { value: 'prof-williams', label: 'Prof. Williams' },
    { value: 'dr-brown', label: 'Dr. Brown' },
    { value: 'prof-jones', label: 'Prof. Jones' }
]; //placeholder for now

type options = {
    label: string;
    value: string;
};

export default function ScholarshipProposalForm() {
    const [hasTemplate, setHasTemplate] = useState(false);

    const [selectedTypes, setSelectedTypes] = useState<options[]>([]);
    const handleChangeTypes = (newValue: MultiValue<options> | SingleValue<options>) => {
        if (newValue === null) {
            setSelectedTypes([]);
        } else {
            setSelectedTypes(newValue as options[]);
        }
    };

    const [selectedAreas, setSelectedAreas] = useState<options[]>([]);
    const handleChangeAreas = (newValue: MultiValue<options>) => {
        setSelectedAreas(newValue as options[]);
    };

    const [selectedJury, setSelectedJury] = useState<options[]>([]);
    const handleChangeJury = (newValue: MultiValue<options>) => {
        setSelectedJury(newValue as options[]);
    };

    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Scholarships Porposals</h1>
            <Card className="w-full">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <Label htmlFor="name">Scholarship Name</Label>
                                <Input id="name" name="name" />
                            </div>

                            <div>
                                <Label htmlFor="type">Scholarship Type</Label>
                                {/* 
                                <Select name="type"> 
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                        <SelectItem value="graduate">Graduate</SelectItem>
                                        <SelectItem value="postdoctoral">Postdoctoral</SelectItem>
                                    </SelectContent>
                                </Select>
                                */}

                                <Select
                                    options={types}
                                    value={selectedTypes}
                                    onChange={handleChangeTypes}
                                    className="mb-4 text-black"
                                    placeholder="Select type"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" className="w-full h-72 max-h-screen" />
                            </div>

                            <div>
                                <Label htmlFor="scientificAreas">Scientific Areas</Label>
                                {/*  
                                <Select name="scientificAreas">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select scientific areas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="computer-science">Computer Science</SelectItem>
                                        <SelectItem value="biology">Biology</SelectItem>
                                        <SelectItem value="physics">Physics</SelectItem>
                                        <SelectItem value="chemistry">Chemistry</SelectItem>
                                        <SelectItem value="mathematics">Mathematics</SelectItem>
                                    </SelectContent>
                                </Select>
                                */}
                                <Select
                                    options={areas}
                                    value={selectedAreas}
                                    onChange={handleChangeAreas}
                                    isMulti={true}
                                    className="mb-4 text-black"
                                    placeholder="Select scientific areas"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="desiredJury">Desired Jury</Label>
                                {/*  
                                <Select name="desiredJury">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select jury members" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prof-smith">Prof. Smith</SelectItem>
                                        <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                                        <SelectItem value="prof-williams">Prof. Williams</SelectItem>
                                        <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                                        <SelectItem value="prof-jones">Prof. Jones</SelectItem>
                                    </SelectContent>
                                </Select>
                                */}
                                <Select
                                    options={jury}
                                    value={selectedJury}
                                    onChange={handleChangeJury}
                                    isMulti={true}
                                    className="mb-4 text-black"
                                    placeholder="Types"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="spots">Number of Spots Available</Label>
                                <Input id="spots" name="spots" type="number" min="1" />
                            </div>
                        </div>

                        <div>
                            <Label>Required Documents</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <Input placeholder="Document name" />
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="hasTemplate" className="w-4 h-4" checked={hasTemplate} onChange={(e) => setHasTemplate(e.target.checked)} />
                                    <Label htmlFor="hasTemplate">Has Template</Label>
                                    {hasTemplate && (
                                        <Input id="doc" type="file" className="w-full mt-2" />
                                    )}
                                    <Button type="button" variant="outline" size="sm">
                                        Add Required Document
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="doc">Add Edict</Label>
                                <Input id="doc" type="file" className="mt-2" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">Submit Proposal</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}