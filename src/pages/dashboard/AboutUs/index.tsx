import React from 'react';
import { CustomInput } from '../../../components/ui/CustomInput';
import { useAppSelector } from '../../../store/hooks';
import { selectIsDarkMode } from '../../../store/slices/Themeslice';

const AboutUs: React.FC = () => {

    const isDarkMode = useAppSelector(selectIsDarkMode);

  return (
    <div className={`  ${isDarkMode ? 'bg-background-light min-h-screen p-6' : 'bg-white'}`}>
      <div >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900 '}`}>About us</h2>
  
        </div>

        {/* Version Information */}
        <div className="space-y-4 mb-32">
          <CustomInput
            label="Firmware version"
            value="v.136265"
            disabled
            className="bg-gray-50"
          />

          <CustomInput
            label="App version"
            value="v.3.1.1"
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* Powered By Section */}
        <div className="mt-32">
          <p className="text-center text-gray-600 text-sm mb-8">Powered by</p>
          
          <div className="flex items-center justify-center gap-12 flex-wrap ">
            {/* Radio Dispatcher Logo */}
            <div className="flex items-center gap-3">
            <img src='/radio-dispatch-logo.png' />
            </div>

            {/* Rapidev Logo */}
            <div className="flex flex-col items-center">
            <img src='/rapidev-logo.png' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;