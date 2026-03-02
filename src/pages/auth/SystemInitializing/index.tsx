import React from 'react';
import {  Typography, Progress, Button } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { CustomButton } from '../../../components/ui/CustomButton';

const { Title, Text } = Typography;

export interface InitStep {
  id: number;
  label: string;
  status: 'completed' | 'loading' | 'pending';
}

interface SystemInitializingProps {
  steps: InitStep[];
  onSkip?: () => void;
  onContinue?: () => void;
  showSkipButton?: boolean;
  continueButtonDisabled?: boolean;
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  autoNavigate?: boolean;
  onComplete?: () => void;
}

const SystemInitializing: React.FC<SystemInitializingProps> = ({
  steps,
  onSkip,
  onContinue,
  showSkipButton = true,
  continueButtonDisabled = false,
  title = 'Initializing System',
  subtitle = 'Please wait while we set up your workspace...',
  showProgress = false,
  autoNavigate = false,
  onComplete,
}) => {
  const getStepIcon = (status: InitStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleFilled className="text-green-500 text-xl" />;
      case 'loading':
        return <LoadingOutlined className="text-blue-500 text-xl" spin />;
      case 'pending':
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStepTextColor = (status: InitStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'loading':
        return 'text-gray-500 font-medium';
      case 'pending':
        return 'text-warning';
    }
  };

  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);
  const isAllCompleted = steps.every(step => step.status === 'completed');

  // Auto-navigate when complete
  React.useEffect(() => {
    if (isAllCompleted && autoNavigate && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAllCompleted, autoNavigate, onComplete]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full ">
        {/* Header */}
        <div className="text-center mb-6">
          <Title level={3} className="mb-2">
            {title}
          </Title>
          <Text className="text-gray-500">
            {subtitle}
          </Text>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <Progress
              percent={progressPercentage}
              status={isAllCompleted ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text className="text-sm text-gray-500 mt-2 block text-center">
              {completedSteps} of {steps.length} steps completed
            </Text>
          </div>
        )}

        {/* Steps List */}
        <div className="mb-8 space-y-3 max-h-96 overflow-y-auto">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 py-1">
              {getStepIcon(step.status)}
              <Text className={`${getStepTextColor(step.status)} text-sm`}>
                {step.label}
              </Text>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {isAllCompleted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <Text className="text-green-700 text-sm">
              ✓ System initialization completed successfully!
            </Text>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          {showSkipButton && (
            <Button type="default" size="large" onClick={onSkip} className="flex-1">Skip</Button>
          )}
          <Button type="primary" size="large" onClick={onContinue} className="flex-1">Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default SystemInitializing;