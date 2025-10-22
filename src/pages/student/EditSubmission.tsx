
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useAppDispatch } from '../../store';
import { internshipsApi } from '../../api/internships';
import { addNotification } from '../../store/slices/notificationSlice';

interface EditSubmissionProps {
  id?: string;
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditSubmission: React.FC<EditSubmissionProps> = ({ id: propId, initialData: propInitialData, onSuccess, onCancel }) => {
  // If not provided as prop, fallback to URL param
  const { id: urlId } = useParams<{ id: string }>();
  const id = propId || urlId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(propInitialData || null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (propInitialData) {
      setInitialData(propInitialData);
      Object.entries(propInitialData).forEach(([key, value]) => {
        if (typeof value !== 'object' || value === null) setValue(key, value);
      });
      if (propInitialData.duration) {
        setValue('startDate', propInitialData.duration.startDate);
        setValue('endDate', propInitialData.duration.endDate);
      }
      setLoading(false);
    } else if (id) {
      internshipsApi.getSubmissionById(id).then((data) => {
        if (data) {
          setInitialData(data);
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value !== 'object' || value === null) setValue(key, value);
          });
          if (data.duration) {
            setValue('startDate', data.duration.startDate);
            setValue('endDate', data.duration.endDate);
          }
        }
        setLoading(false);
      });
    }
  }, [id, propInitialData, setValue]);

  const onSubmit = async (formData: any) => {
    if (!id) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        duration: {
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      };
      await internshipsApi.updateSubmission(id, payload);
      dispatch(addNotification({
        title: 'Submission updated',
        message: 'Your submission was updated successfully.',
        type: 'success',
      }));
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/submissions/${id}`);
      }
    } catch (error) {
      dispatch(addNotification({
        title: 'Update failed',
        message: 'Could not update submission. Please try again.',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-lg text-blue-700 font-medium">Loading submission...</span>
      </div>
    </div>
  );
  if (!initialData) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission not found</h2>
        <p className="text-gray-500 mb-4">The submission you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => onCancel ? onCancel() : navigate('/submissions')}>Back to Submissions</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="pb-2 border-b-0">
          <p className="text-gray-500 mt-1 text-md">Update your internship details below. Fields marked with <span className='text-pink-600 font-bold'>*</span> are required.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={<span>Company Name <span className='text-pink-600'>*</span></span>} defaultValue={initialData.companyName} {...register('companyName', { required: 'Company name is required' })} error={typeof errors.companyName?.message === 'string' ? errors.companyName.message : undefined} />
              <Input label={<span>Company Address <span className='text-pink-600'>*</span></span>} defaultValue={initialData.companyAddress} {...register('companyAddress', { required: 'Company address is required' })} error={typeof errors.companyAddress?.message === 'string' ? errors.companyAddress.message : undefined} />
              <Input label={<span>Supervisor Name <span className='text-pink-600'>*</span></span>} defaultValue={initialData.supervisorName} {...register('supervisorName', { required: 'Supervisor name is required' })} error={typeof errors.supervisorName?.message === 'string' ? errors.supervisorName.message : undefined} />
              <Input label={<span>Supervisor Email <span className='text-pink-600'>*</span></span>} defaultValue={initialData.supervisorEmail} {...register('supervisorEmail', { required: 'Supervisor email is required' })} error={typeof errors.supervisorEmail?.message === 'string' ? errors.supervisorEmail.message : undefined} />
              <Input label={<span>Position <span className='text-pink-600'>*</span></span>} defaultValue={initialData.position} {...register('position', { required: 'Position is required' })} error={typeof errors.position?.message === 'string' ? errors.position.message : undefined} />
              <Input label={<span>Start Date <span className='text-pink-600'>*</span></span>} type="date" defaultValue={initialData.duration?.startDate} {...register('startDate', { required: 'Start date is required' })} error={typeof errors.startDate?.message === 'string' ? errors.startDate.message : undefined} />
              <Input label={<span>End Date <span className='text-pink-600'>*</span></span>} type="date" defaultValue={initialData.duration?.endDate} {...register('endDate', { required: 'End date is required' })} error={typeof errors.endDate?.message === 'string' ? errors.endDate.message : undefined} />
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <Textarea label={<span>Description <span className='text-pink-600'>*</span></span>} defaultValue={initialData.description} {...register('description', { required: 'Description is required' })} error={typeof errors.description?.message === 'string' ? errors.description.message : undefined} rows={5} />
            </div>
            {/* Documents editing can be added here if needed */}
            <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-8">
              <Button type="submit" disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-150">
                Save Changes
              </Button>
              <Button type="button" variant="secondary" className="w-full md:w-auto border border-blue-200 text-blue-700 font-semibold" onClick={() => onCancel ? onCancel() : navigate(`/submissions/${id}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
