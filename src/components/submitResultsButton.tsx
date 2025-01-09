'use client';

import React, { useState } from 'react';
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
import { Check } from "lucide-react";

const SubmitResultsButton = ({ 
  applications, 
  results, 
  scholarshipId, 
  accessToken 
}) => {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);  // New state for error dialog
  const [error, setError] = useState('');
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const checkAllApplicationsGraded = () => {
    if (!results || !applications) return false;
    return applications.every(app => 
      results.some(result => result.application_id === app.id)
    );
  };

  const handleSubmit = async () => {
    try {
      console.log("Starting submission...");
      const response = await fetch('http://localhost:8003/grading/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scholarship_id: scholarshipId,
          results: results,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit results');
      }

      // Parse the response JSON to handle specific messages
      const responseData = await response.json();
      console.log("Response Data:", responseData); // Debugging log

      // Check if the response contains a message
      if (responseData.message) {
        console.log("Message from server:", responseData.message); // Debugging log
        if (responseData.message === "No grading results found for this scholarship.") {
          setError("No grading results found for this scholarship. Please check the scholarship ID.");
          setShowErrorDialog(true); // Show the error dialog
          return;
        }
        if (responseData.message === "Not all juries have graded all applications.") {
          setError("Not all juries have graded all applications.");
          setShowErrorDialog(true); // Show the error dialog
          return;
        }
        if (responseData.message === "Results already submitted for this scholarship.") {
          setError("Results already submitted for this scholarship.");
          setShowErrorDialog(true); // Show the error dialog
          return;
        }
      }

      setShowSubmitDialog(false);
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Failed to submit results:', error);
      setError('Failed to submit results. Please try again.');
      setShowErrorDialog(true); // Show the error dialog
    }
  };

  const isSubmitEnabled = checkAllApplicationsGraded();

  return (
    <>
      <Button
        variant="default"
        className="mt-4 w-full bg-green-600 text-white hover:bg-green-700"
        disabled={!isSubmitEnabled}
        onClick={() => setShowSubmitDialog(true)}
      >
        <Check className="mr-2 h-4 w-4" />
        {submissionComplete ? 'Results Submitted' : 'Submit All Results'}
      </Button>

      {/* Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit All Results</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit all results? This action cannot be undone.
              Please verify that you have reviewed all applications carefully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setError(''); // Reset error when canceling
                setShowSubmitDialog(false); // Close dialog when canceling
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Confirm Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "An unknown error occurred."}  {/* Default error message if error is empty */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubmitResultsButton;
