import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateResume } from '@redux/slices/resumeSlice';
import { debounce } from 'lodash';

export const useResume = (resumeId) => {
  const dispatch = useDispatch();
  const { currentResume, isLoading } = useSelector((state) => state.resume);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save function (debounced)
  const autoSave = debounce((data) => {
    if (resumeId) {
      dispatch(updateResume({ id: resumeId, data }));
      setHasUnsavedChanges(false);
    }
  }, 2000);

  const updateField = (field, value) => {
    setHasUnsavedChanges(true);
    const updatedData = { ...currentResume, [field]: value };
    autoSave(updatedData);
  };

  return {
    resume: currentResume,
    isLoading,
    hasUnsavedChanges,
    updateField,
  };
};