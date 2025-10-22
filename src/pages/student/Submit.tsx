import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../store'
import { addSubmission } from '../../store/slices/internshipSlice'
import { addNotification } from '../../store/slices/notificationSlice'
import { internshipsApi } from '../../api/internships'
import { supervisorDirectoryApi, SupervisorDirectoryEntry } from '../../api/supervisorDirectory'

interface SubmissionForm {
  companyName: string
  companyAddress: string
  supervisorName: string
  supervisorEmail: string
  position: string
  startDate: string
  endDate: string
  description: string
}

// No longer needed: interface UploadedDocument
export const Submit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [documents, setDocuments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [supervisors, setSupervisors] = useState<SupervisorDirectoryEntry[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorDirectoryEntry | null>(null);
  // Fetch supervisors on mount
  useEffect(() => {
    supervisorDirectoryApi.getSupervisors().then(setSupervisors);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmissionForm>();

  const onSubmit = async (data: SubmissionForm) => {
  // console.log('SUBMIT FORM DATA:', data);
    if (documents.length === 0) {
      dispatch(
        addNotification({
          title: "Documents required",
          message: "Please upload at least one supporting document",
          type: "warning",
        })
      );
      return;
    }

    if (!user) {
      dispatch(
        addNotification({
          title: "Not authenticated",
          message: "You must be logged in to submit an internship",
          type: "error",
        })
      );
      return;
    }

    setSubmitting(true);
    try {
      const submission = await internshipsApi.createSubmission({
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        supervisorName: data.supervisorName,
        supervisorEmail: data.supervisorEmail,
        position: data.position,
        duration: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
        description: data.description,
        documents,
      });

      console.log(submission);
      dispatch(addSubmission(submission));
      dispatch(
        addNotification({
          title: "Submission successful",
          message: "Your internship has been submitted for verification",
          type: "success",
        })
      );

      navigate("/status");
    } catch (error) {
      dispatch(
        addNotification({
          title: "Submission failed",
          message: "Please check your information and try again",
          type: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Submit Internship for Verification
        </h1>
        <p className="text-gray-600 mt-2">
          Provide detailed information about your internship experience
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Company Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Company Name"
              {...register("companyName", {
                required: "Company name is required",
              })}
              error={errors.companyName?.message}
              placeholder="Enter the company name"
            />

            <Textarea
              label="Company Address"
              {...register("companyAddress", {
                required: "Company address is required",
              })}
              error={errors.companyAddress?.message}
              placeholder="Enter the complete company address"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Supervisor Email"
                options={[
                  { value: '', label: 'Select supervisor email' },
                  ...supervisors.map(s => ({ value: s.email, label: s.email }))
                ]}
                {...register('supervisorEmail', { required: 'Supervisor email is required' })}
                error={errors.supervisorEmail?.message}
                onChange={async e => {
                  const email = e.target.value;
                  let supervisor = supervisors.find(s => s.email === email) || null;
                  if (email && !supervisor) {
                    // fallback: fetch name by email if not in list
                    try {
                      const name = await supervisorDirectoryApi.getSupervisorNameByEmail(email);
                      supervisor = { email, name };
                    } catch {
                      supervisor = null;
                    }
                  }
                  setSelectedSupervisor(supervisor);
                  // Set value in form
                  setValue('supervisorName', supervisor?.name || '');
                  // @ts-ignore
                  register('supervisorEmail').onChange(e);
                }}
              />

              <Input
                label="Supervisor Name"
                value={selectedSupervisor?.name || ''}
                readOnly
                placeholder="Supervisor name will appear here"
                error={errors.supervisorName?.message}
                {...register('supervisorName', { required: 'Supervisor name is required' })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Internship Details */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Internship Details
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Position/Role"
              {...register("position", { required: "Position is required" })}
              error={errors.position?.message}
              placeholder="e.g., Software Developer Intern"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                error={errors.startDate?.message}
              />

              <Input
                label="End Date"
                type="date"
                {...register("endDate", { required: "End date is required" })}
                error={errors.endDate?.message}
              />
            </div>

            <Textarea
              label="Internship Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 100,
                  message: "Description must be at least 100 characters",
                },
              })}
              error={errors.description?.message}
              placeholder="Describe your internship experience, responsibilities, projects worked on, and skills gained..."
              rows={6}
              helperText="Minimum 100 characters required"
            />
          </CardContent>
        </Card>

        {/* Document URL Input (temporary) */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Supporting Document Link
            </h2>
            <p className="text-sm text-gray-600">
              Paste a public URL to your internship certificate, report, or
              other document
            </p>
          </CardHeader>
          <CardContent>
            <Input
              label="Document Link"
              placeholder="Paste any document link or description here"
              value={documents[0] || ""}
              onChange={(e) => {
                const val = e.target.value;
                setDocuments(val ? [val] : []);
              }}
              error={documents.length === 0 ? "Document link is required" : ""}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={submitting}
            disabled={documents.length === 0}
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </div>
  );
};