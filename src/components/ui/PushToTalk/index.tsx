import { AudioOutlined,  StopOutlined } from "@ant-design/icons";
import { Typography, message} from "antd";
import { useCallback, useMemo, useState } from "react";
import { CustomButton } from "../CustomButton";
import { ConfirmationModal } from "../ConfirmationModal";
import {
  useStartCallMutation,
  useStopCallMutation,
} from "../../../store/api/callOperations";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

const { Text } = Typography;

type CallType = "PRIVATE" | "GROUP" | "BROADCAST";

interface ActiveCall {
  id: number;
  callType: CallType;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

const DEFAULT_VOLUME_LEVEL = 60;
const DEFAULT_MIC_LEVEL = 80;
const DEFAULT_UNIT = "R-101 - Unit Alpha-1";
const CALL_TYPE_BROADCAST: CallType = "BROADCAST";
const RADIO_ID_REGEX = /R-(\d+)/;
const SLIDER_HEIGHT = 16;
const SLIDER_BORDER_RADIUS = 12;
const SLIDER_RAIL_BORDER_RADIUS = 10;
const SLIDER_HANDLE_MARGIN_TOP = 6.4;

const getSliderStyles = () => ({
  track: {
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_BORDER_RADIUS,
  },
  handle: {
    marginTop: SLIDER_HANDLE_MARGIN_TOP,
    marginLeft: -3,
  },
  rail: {
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_RAIL_BORDER_RADIUS,
  },
});

export const PushToTalkSection = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [selectedUnit] = useState<string>(DEFAULT_UNIT);
  // const [volumeLevel, setVolumeLevel] = useState<number>(DEFAULT_VOLUME_LEVEL);
  // const [micLevel, setMicLevel] = useState<number>(DEFAULT_MIC_LEVEL);
  // const [isTX, setIsTX] = useState<boolean>(true);
  // const [isRX, setIsRX] = useState<boolean>(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [pendingCall, setPendingCall] = useState<CallType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [startCall, { isLoading: isStarting }] = useStartCallMutation();
  const [stopCall, { isLoading: isStopping }] = useStopCallMutation();

  // const sliderStyles = useMemo(() => getSliderStyles(), []); 

  const extractRadioId = useCallback((unitString: string): number => {
    const match = unitString.match(RADIO_ID_REGEX);
    return match ? parseInt(match[1], 10) : 0;
  }, []);

  const getCallTypeLabel = useCallback((callType: CallType): string => {
    switch (callType) {
      case "PRIVATE":
        return "Private";
      case "GROUP":
        return "Group";
      case "BROADCAST":
        return "Broadcast";
      default:
        return callType;
    }
  }, []);

  const handleStartCall = useCallback(
    async (callType: CallType): Promise<void> => {
      if (activeCall && activeCall.callType !== callType) {
        setPendingCall(callType);
        setShowConfirmModal(true);
        return;
      }

      if (activeCall && activeCall.callType === callType) {
        message.warning(`${getCallTypeLabel(callType)} call is already active`);
        return;
      }

      const radioId = extractRadioId(selectedUnit);
      if (!radioId) {
        message.error("Invalid radio ID selected");
        return;
      }

      try {
        const response = await startCall({
          id: radioId,
          callType,
        }).unwrap();

        if (response.success) {
          setActiveCall({
            id: radioId,
            callType,
          });
          message.success(response.message || "Call started successfully");
        }
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          "Failed to start call";
        message.error(errorMessage);
      }
    },
    [activeCall, selectedUnit, extractRadioId, startCall, getCallTypeLabel],
  );

  const handleStopCall = useCallback(async (): Promise<void> => {
    if (!activeCall) return;

    try {
      const response = await stopCall({
        id: activeCall.id,
        callType: activeCall.callType,
      }).unwrap();

      if (response.success) {
        setActiveCall(null);
        message.success(response.message || "Call stopped successfully");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.message || "Failed to stop call";
      message.error(errorMessage);
    }
  }, [activeCall, stopCall]);

  const handleConfirmSwitch = useCallback(async (): Promise<void> => {
    if (!pendingCall || !activeCall) return;

    try {
      const stopResponse = await stopCall({
        id: activeCall.id,
        callType: activeCall.callType,
      }).unwrap();

      if (stopResponse.success) {
        const radioId = extractRadioId(selectedUnit);
        if (!radioId) {
          message.error("Invalid radio ID selected");
          setPendingCall(null);
          setShowConfirmModal(false);
          return;
        }

        const startResponse = await startCall({
          id: radioId,
          callType: pendingCall,
        }).unwrap();

        if (startResponse.success) {
          setActiveCall({
            id: radioId,
            callType: pendingCall,
          });
          message.success(
            startResponse.message || "Call switched successfully",
          );
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.message || "Failed to switch call";
      message.error(errorMessage);
    } finally {
      setPendingCall(null);
      setShowConfirmModal(false);
    }
  }, [
    pendingCall,
    activeCall,
    stopCall,
    startCall,
    selectedUnit,
    extractRadioId,
  ]);

  const handleCancelSwitch = useCallback((): void => {
    setPendingCall(null);
    setShowConfirmModal(false);
  }, []);

  const handlePushToTalkClick = useCallback((): void => {
    if (!activeCall) {
      handleStartCall(CALL_TYPE_BROADCAST);
    }
  }, [activeCall, handleStartCall]);

  const isBroadcasting = useMemo(
    () => activeCall?.callType === CALL_TYPE_BROADCAST,
    [activeCall],
  );
  const isDisabled = useMemo(
    () => isStarting || isStopping || !!activeCall,
    [isStarting, isStopping, activeCall],
  );
  const buttonClassName = useMemo(() => {
    const baseClasses =
      "w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 select-none mb-4";
    const activeClasses = isBroadcasting
      ? "bg-gradient-to-br from-red-700 to-red-500 scale-95 shadow-lg"
      : "bg-gradient-to-br from-red-500 to-red-400 hover:scale-105 shadow-xl";
    const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";
    return `${baseClasses} ${activeClasses} ${disabledClasses}`;
  }, [isBroadcasting, isDisabled]);

  // const handleVolumeChange = useCallback((value: number | number[]): void => {
  //   setVolumeLevel(Array.isArray(value) ? value[0] : value);
  // }, []);

  // const handleMicChange = useCallback((value: number | number[]): void => {
  //   setMicLevel(Array.isArray(value) ? value[0] : value);
  // }, []);

  // const toggleTX = useCallback((): void => {
  //   setIsTX((prev) => !prev);
  // }, []);

  // const toggleRX = useCallback((): void => {
  //   setIsRX((prev) => !prev);
  // }, []);

  const modalTitle = useMemo(() => {
    if (!pendingCall || !activeCall) return "Switch Call Type";
    return `Switch to ${getCallTypeLabel(pendingCall)} Call?`;
  }, [pendingCall, activeCall, getCallTypeLabel]);

  const modalMessage = useMemo(() => {
    if (!pendingCall || !activeCall) return "";
    return `You have an active ${getCallTypeLabel(activeCall.callType)} call. Do you want to switch to ${getCallTypeLabel(pendingCall)} call?`;
  }, [pendingCall, activeCall, getCallTypeLabel]);

  return (
    <div className="sticky top-6 w-full  flex items-center justify-center">
      <div className="rounded-lg transition-colors">
        <div className="flex gap-5 relative items-center">
          <div className="flex flex-col px-10 items-center">
            <button
              type="button"
              className={buttonClassName}
              onClick={isDisabled ? undefined : handlePushToTalkClick}
              disabled={isDisabled}
              aria-label={isBroadcasting ? "Broadcasting" : "Push to Talk"}
            >
              <AudioOutlined className="text-4xl text-white" />
            </button>

            <Text
              strong
              className={`text-base mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Push to Talk
            </Text>

            <Text
              className={`text-xs mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {isBroadcasting ? "Broadcasting..." : "Click to transmit"}
            </Text>

            {isBroadcasting && (
              <CustomButton
                icon={<StopOutlined />}
                onClick={handleStopCall}
                loading={isStopping}
                className="bg-red-500 hover:bg-red-600 mb-4 w-full"
              >
                Stop Broadcast
              </CustomButton>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};
