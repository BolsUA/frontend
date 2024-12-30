'use client'

import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

const GradeApplicationDialog = ({ session, application }) => {
	const [showMainDialog, setShowMainDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [showGradeDialog, setShowGradeDialog] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [grade, setGrade] = useState('');
	const [error, setError] = useState('');

	const handleReject = async () => {
		if (!rejectReason.trim()) {
			setError('Please provide a reason for rejection');
			return;
		}

		try {
			const response = await fetch('http://localhost:8003/grading/grade', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${session?.accessToken}`
				},
				body: JSON.stringify({
					scholarship_id: application.scholarship_id,
					student_id: application.user_id,
					grade: rejectReason,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to reject application');
			}

			setShowRejectDialog(false);
			setShowMainDialog(false);
			setRejectReason('');
		} catch (error) {
			console.error('Failed to reject application:', error);
		}
	};

	const handleGrade = async () => {
		const gradeNum = parseFloat(grade);
		if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 20) {
			setError('Please enter a valid grade between 0 and 20');
			return;
		}

		try {
			const response = await fetch('http://localhost:8003/grading/grade', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${session?.accessToken}`
				},
				body: JSON.stringify({
					scholarship_id: application.scholarship_id,
					student_id: application.user_id,
					grade: gradeNum,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to grade application');
			}

			setShowGradeDialog(false);
			setShowMainDialog(false);
			setGrade('');
		} catch (error) {
			console.error('Failed to grade application:', error);
		}
	};

	return (
		<>
			<Dialog open={showMainDialog} onOpenChange={setShowMainDialog}>
				<DialogTrigger asChild>
					<Button variant="outline" className="h-9 bg-blue-600">
						Grade
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Grade Application</DialogTitle>
						<DialogDescription>
							Choose whether to grade or reject this application
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-center space-x-4 mt-4">
						<Button
							variant="destructive"
							onClick={() => {
								setShowMainDialog(false);
								setShowRejectDialog(true);
							}}
						>
							Reject
						</Button>
						<Button
							variant="default"
							onClick={() => {
								setShowMainDialog(false);
								setShowGradeDialog(true);
							}}
						>
							Grade
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reject Application</AlertDialogTitle>
						<AlertDialogDescription>
							Please provide a reason for rejecting this application
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="reason">Reason</Label>
							<Input
								id="reason"
								placeholder="Enter rejection reason"
								value={rejectReason}
								onChange={(e) => setRejectReason(e.target.value)}
							/>
							{error && <p className="text-red-500 text-sm">{error}</p>}
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => {
							setError('');
							setRejectReason('');
						}}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleReject}>
							Confirm Rejection
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Grade Application</AlertDialogTitle>
						<AlertDialogDescription>
							Enter a grade between 0 and 20
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="grade">Grade</Label>
							<Input
								id="grade"
								type="number"
								step="0.1"
								min="0"
								max="20"
								placeholder="Enter grade (0-20)"
								value={grade}
								onChange={(e) => setGrade(e.target.value)}
							/>
							{error && <p className="text-red-500 text-sm">{error}</p>}
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => {
							setError('');
							setGrade('');
						}}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleGrade}>
							Submit Grade
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default GradeApplicationDialog;