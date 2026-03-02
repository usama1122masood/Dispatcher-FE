import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { useLoginMutation } from "../../../store/api/authApi";
// import { useAppDispatch } from "../../../store/hooks";
// import { setCredentials } from "../../../store/slices/authSlice";
// import {
//   CustomInput,
//   CustomPassword,
// } from "../../../components/ui/CustomInput";
// import { CustomButton } from "../../../components/ui/CustomButton";

import login_css from "./login.module.css";
import SystemInitializing from "../SystemInitializing";

// const { Title } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

interface InitStep {
  id: number;
  label: string;
  status: "completed" | "loading" | "pending";
}

const Login: React.FC = () => {
  const navigate = useNavigate();


  const [currentStep, setCurrentStep] = useState(0);

  console.log('current step _> ', currentStep);

  const [steps, setSteps] = useState<InitStep[]>([
    { id: 1, label: "Connecting to Base Station Radio", status: "completed" },
    { id: 2, label: "Loading Map Engine", status: "loading" },
    { id: 3, label: "Syncing Radio List", status: "pending" },
    { id: 4, label: "Loading Geofences & Objects", status: "pending" },
    { id: 5, label: "Restoring Session", status: "pending" },
    { id: 6, label: "System Ready", status: "pending" },
    { id: 7, label: "Establishing Connection", status: "pending" },
    { id: 8, label: "Fetching User Preferences", status: "pending" },
    { id: 9, label: "Verifying Security Protocols", status: "pending" },
    { id: 10, label: "Updating Software Modules", status: "pending" },
    { id: 11, label: "Initializing Dashboard", status: "pending" },
  ]);

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const {

  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit = async (values: LoginFormData) => {
  //   try {
  //     const result = await login(values).unwrap();
  //     dispatch(setCredentials(result));
  //     message.success("Login successful!");
  //     navigate("/onboarding");
  //   } catch (error: any) {
  //     message.error(error?.data?.message || "Login failed");
  //   }
  // };

  useEffect(() => {
    // Auto-progress through steps
    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        const loadingIndex = newSteps.findIndex(
          (step) => step.status === "loading"
        );

        if (loadingIndex !== -1 && loadingIndex < newSteps.length - 1) {
          newSteps[loadingIndex].status = "completed";
          newSteps[loadingIndex + 1].status = "loading";
          setCurrentStep(loadingIndex + 1);
        } else if (loadingIndex === newSteps.length - 1) {
          newSteps[loadingIndex].status = "completed";
          setCurrentStep(newSteps.length);
        }

        return newSteps;
      });
    }, 2000); // Progress every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 ${login_css.login_container}`}
    >
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* <div>


        <Title level={4} className="mb-6">Login to your Account</Title>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Please input your email!',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email!',
              },
            }}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Email"
                placeholder="Enter email here..."
                required
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Please input your password!',
            }}
            render={({ field }) => (
              <CustomPassword
                {...field}
                label="Password"
                placeholder="Enter password here..."
                required
                error={errors.password?.message}
              />
            )}
          />

          <div className="mt-4">
            <CustomButton
              label="Login"
              htmlType="submit"
              fullWidth
              loading={isLoading}
            />
          </div>

          <div className="text-center mt-4">
            Don't have an account? <a onClick={() => navigate('/signup')}>Sign up</a>
          </div>
        </form>

        </div> */}

        <SystemInitializing
          steps={steps}
          onSkip={handleSkip}
          onContinue={handleContinue}
          showSkipButton={true}
        />
      </Card>
    </div>
  );
};

export default Login;
