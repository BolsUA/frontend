"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import Select, { MultiValue, SingleValue } from 'react-select';
import { useSession } from "next-auth/react";


interface Document {
    name: string;
    hasTemplate: boolean;
    template: File | null;
}

interface FormData {
    name: string;
    description: string;
    scientificAreas: string[];
    type: string;
    desiredJury: string[];
    spots: string;
    requiredDocuments: Document[];
    edict: File | null;
    deadline: string;
}

interface FormErrors {
    [key: string]: string;
}

const initialFormData: FormData = {
    name: '',
    description: '',
    scientificAreas: [],
    type: '',
    desiredJury: [],
    spots: '',
    requiredDocuments: [{ name: '', hasTemplate: false, template: null }],
    edict: null,
    deadline: new Date().toISOString(),
}


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
    const { data: session } = useSession()

    const [selectedTypes, setSelectedTypes] = useState<options[]>([]);
    const handleChangeTypes = (newValue: SingleValue<options>) => {
        setSelectedTypes(newValue ? [newValue as options] : []);
        setFormData(prev => ({ ...prev, type: newValue ? (newValue as options).value : '' }));
    };

    const [selectedAreas, setSelectedAreas] = useState<options[]>([]);
    const handleChangeAreas = (newValue: MultiValue<options>) => {
        setSelectedAreas(newValue as options[]);
        setFormData(prev => ({ ...prev, scientificAreas: newValue.map((v) => v.value) }));
    };

    const [selectedJury, setSelectedJury] = useState<options[]>([]);
    const handleChangeJury = (newValue: MultiValue<options>) => {
        setSelectedJury(newValue as options[]);
        setFormData(prev => ({ ...prev, desiredJury: newValue.map((v) => v.value) }));
    };

    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleDocumentChange = (index: number, field: keyof Document, value: string | boolean | File | null) => {
        const updatedDocuments = [...formData.requiredDocuments]
        updatedDocuments[index] = { ...updatedDocuments[index], [field]: value }
        setFormData(prev => ({ ...prev, requiredDocuments: updatedDocuments }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, edict: file }))
        }
    }


    const addDocument = () => {
        setFormData(prev => ({
            ...prev,
            requiredDocuments: [...prev.requiredDocuments, { name: '', hasTemplate: false, template: null }]
        }))
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!formData.name) newErrors.name = 'Scholarship name is required'
        if (!formData.description) newErrors.description = 'Description is required'
        if (formData.scientificAreas.length === 0) newErrors.scientificAreas = 'At least one scientific area is required'
        if (!formData.type) newErrors.type = 'Scholarship type is required'
        if (formData.desiredJury.length === 0) newErrors.desiredJury = 'At least one jury member is required'
        if (!formData.spots) newErrors.spots = 'Number of spots is required'
        if (formData.requiredDocuments.some(doc => !doc.name)) {
            newErrors.requiredDocuments = 'All document names are required'
        }
        if (!formData.edict) newErrors.edict = 'Edict is required'
        if (!formData.deadline) newErrors.deadline = 'Deadline is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        if (validateForm()) {
            console.log('Form submitted:', formData)
            // Simulate API call

            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("publisher", session!.user!.name || 'Unknown');
            formDataToSubmit.append("type", formData.type);
            formDataToSubmit.append("deadline", formData.deadline);
            formDataToSubmit.append("jury", formData.desiredJury[0]);
            formDataToSubmit.append("status", "Open");
            formDataToSubmit.append("scientific_areas", JSON.stringify(formData.scientificAreas));

            // Append the file if present
            if (formData.edict) {
                formDataToSubmit.append("edict_file", formData.edict);
            }

            await fetch("http://localhost:8000/proposals", {
                method: "POST",
                body: formDataToSubmit,
            });

            setIsSubmitted(true);
        };
    }

        if (isSubmitted) {
            return (
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        Your scholarship proposal has been submitted successfully and will be reviewed.
                    </AlertDescription>
                </Alert>
            )
        }

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Scholarships Proposals</h1>
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Label htmlFor="name">Scholarship Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className={errors.name ? 'border-red-500' : ''} />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="type">Scholarship Type</Label>
                                    <Select
                                        options={types}
                                        value={selectedTypes}
                                        onChange={handleChangeTypes}
                                        className="mb-4 text-black"
                                        placeholder="Select type"
                                    />
                                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className={errors.description ? 'border-red-500' : 'w-full h-72 max-h-screen'} />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="scientificAreas">Scientific Areas</Label>
                                    <Select
                                        options={areas}
                                        value={selectedAreas}
                                        onChange={handleChangeAreas}
                                        isMulti={true}
                                        className="mb-4 text-black"
                                        placeholder="Select scientific areas"
                                    />
                                    {errors.scientificAreas && <p className="text-red-500 text-sm mt-1">{errors.scientificAreas}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="desiredJury">Desired Jury</Label>
                                    <Select
                                        options={jury}
                                        value={selectedJury}
                                        onChange={handleChangeJury}
                                        isMulti={true}
                                        className="mb-4 text-black"
                                        placeholder="Types"
                                    />
                                    {errors.desiredJury && <p className="text-red-500 text-sm mt-1">{errors.desiredJury}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="spots">Number of Spots Available</Label>
                                    <Input id="spots" name="spots" type="number" min="1" value={formData.spots} onChange={handleInputChange} className={errors.spots ? 'border-red-500' : ''} />
                                    {errors.spots && <p className="text-red-500 text-sm mt-1">{errors.spots}</p>}
                                </div>
                            </div>

                            <div>
                                <Label>Required Documents</Label>
                                {formData.requiredDocuments.map((doc, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 mt-2 items-center">
                                        <Input
                                            placeholder="Document name"
                                            value={doc.name}
                                            onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                            className={errors.requiredDocuments ? 'border-red-500' : ''}
                                        />
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`hasTemplate-${index}`}
                                                checked={doc.hasTemplate}
                                                onChange={(e) => handleDocumentChange(index, 'hasTemplate', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor={`hasTemplate-${index}`}>Has Template</Label>
                                            {doc.hasTemplate && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const input = document.createElement('input')
                                                        input.type = 'file'
                                                        input.onchange = (e) => {
                                                            const file = (e.target as HTMLInputElement).files?.[0]
                                                            if (file) {
                                                                handleDocumentChange(index, 'template', file)
                                                            }
                                                        }
                                                        input.click()
                                                    }}
                                                >
                                                    Upload Template
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {errors.requiredDocuments && <p className="text-red-500 text-sm mt-1">{errors.requiredDocuments}</p>}
                                <Button type="button" variant="outline" onClick={addDocument} className="mt-2">
                                    Add Document
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor="edict">Edict</Label>
                                <input
                                    type="file"
                                    id="edict"
                                    name="edict"
                                    className="w-full"
                                    onChange={handleFileChange}
                                />
                                {errors.edict && <p className="text-red-500 text-sm mt-1">{errors.edict}</p>}
                            </div>

                            <div>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} className={errors.deadline ? 'border-red-500' : ''} />
                                {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Please correct the errors in the form before submitting.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full">Submit Proposal</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }