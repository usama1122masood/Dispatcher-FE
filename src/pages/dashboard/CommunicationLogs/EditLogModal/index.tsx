// react
import React, { useState } from 'react';

// antd components
import { Modal, Button } from 'antd';

// ui components custom
import { CustomInput } from '../../../../components/ui/CustomInput';
import { CustomSelect } from '../../../../components/ui/CustomSelect';

interface EditLogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: LogFormValues) => void;
  initialValues?: LogFormValues;
}

export interface LogFormValues {
  radioName: string;
  imei: string;
  radioId: string;
  profile: string;
  icon: string;
}

const EditLogModal: React.FC<EditLogModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [formValues, setFormValues] = useState<LogFormValues>(
    initialValues || {
      radioName: '',
      imei: '',
      radioId: '',
      profile: '',
      icon: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof LogFormValues, string>>>({});

  const profileOptions = [
    { value: 'teflon_267', label: 'Teflon 267' },
    { value: 'alpha_100', label: 'Alpha 100' },
    { value: 'bravo_200', label: 'Bravo 200' },
    { value: 'charlie_300', label: 'Charlie 300' },
    { value: 'delta_400', label: 'Delta 400' },
  ];

  const iconOptions = [
    { value: 'portable_radio', label: 'Portable Radio' },
    { value: 'base_station', label: 'Base Station' },
    { value: 'mobile_radio', label: 'Mobile Radio' },
    { value: 'repeater', label: 'Repeater' },
    { value: 'handheld', label: 'Handheld' },
  ];

  const handleInputChange = (field: keyof LogFormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LogFormValues, string>> = {};

    if (!formValues.radioName.trim()) {
      newErrors.radioName = 'Radio name is required';
    }
    if (!formValues.imei.trim()) {
      newErrors.imei = 'IMEI is required';
    }
    if (!formValues.radioId.trim()) {
      newErrors.radioId = 'Radio ID is required';
    }
    if (!formValues.profile) {
      newErrors.profile = 'Profile is required';
    }
    if (!formValues.icon) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formValues);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormValues(
      initialValues || {
        radioName: '',
        imei: '',
        radioId: '',
        profile: '',
        icon: '',
      }
    );
    setErrors({});
    onClose();
  };

  // Update form values when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      closable={false}
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formValues.radioId || 'Rad 123'}
            </h2>
          </div>
          <Button
            type="text"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <CustomInput
          label="Radio Name"
          placeholder="Radio Alpha 1"
          value={formValues.radioName}
          onChange={(e) => handleInputChange('radioName', e.target.value)}
          error={errors.radioName}
        />

        <CustomInput
          label="IMEI"
          placeholder="166226261611"
          value={formValues.imei}
          onChange={(e) => handleInputChange('imei', e.target.value)}
          error={errors.imei}
        />

        <CustomInput
          label="Radio ID"
          placeholder="5"
          value={formValues.radioId}
          onChange={(e) => handleInputChange('radioId', e.target.value)}
          error={errors.radioId}
        />

        <CustomSelect
          label="Profile"
          placeholder="Teflon 267"
          options={profileOptions}
          value={formValues.profile}
          onChange={(value) => handleInputChange('profile', value as string)}
          error={errors.profile}
        />

        <CustomSelect
          label="Icon"
          placeholder="Portable Radio"
          options={iconOptions}
          value={formValues.icon}
          onChange={(value) => handleInputChange('icon', value as string)}
          error={errors.icon}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default EditLogModal;