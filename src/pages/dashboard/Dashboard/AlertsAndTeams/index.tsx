import React, { useState } from "react";
import { Collapse, Badge, Button } from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";

import {
  useDeleteAlertByIdMutation,
  useGetAlertsQuery,
  useGetTeamsQuery,
} from "../../../../store/api/dashboardApi";
import { TaskTypeIcons } from "../../../../components/ui/icons/TaskTypeIcons";
import SignalIcon from "../../../../assets/icons/signal";
import BatteryFullIcon from "../../../../assets/icons/BatteryFull";
import Battery75Icon from "../../../../assets/icons/Battery75";
import BatteryLowIcon from "../../../../assets/icons/BatteryLow";

const { Panel } = Collapse;

interface AlertItem {
  id: string;
  type: "warning" | "emergency";
  title: string;
  subtitle: string;
  time: string;
}

interface UnitMember {
  id: string;
  name: string;
  code: string;
  status: "online" | "busy" | "offline";
  channel: string;
  signalStrength: number;
  batteryLevel: number;
}

interface Team {
  id: string;
  name: string;
  members: UnitMember[];
}

const AlertsAndTeams: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [activeKey, setActiveKey] = useState<string | null>("alerts");

  // API Calls
  const { data: alerts = [] } = useGetAlertsQuery(undefined, {
    skipPollingIfUnfocused: true,
  });

  const [deleteAlertById] = useDeleteAlertByIdMutation();

  const { data: teams = [] } = useGetTeamsQuery(undefined, {
    skipPollingIfUnfocused: true,
  });

  const handleAlertDone = (alertId: string) => {
    deleteAlertById(alertId);
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-blue-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getSignalColorClass = (strength: number) => {
    if (strength >= 70) return "text-green-500"; // Green
    if (strength >= 40) return "text-yellow-500"; // Orange
    return "text-red-500"; // Red
  };

  const getBatteryIconByStrength = (strength: number) => {
    if (strength >= 80)
      return <BatteryFullIcon className="size-6 -mt-1 text-green-500" />;
    else if (strength >= 50)
      return <Battery75Icon className="size-6 -mt-1 text-yellow-500" />;
    return <BatteryLowIcon className="size-6 -mt-1 text-red-500" />;
  };

  const AlertCard: React.FC<{ alert: AlertItem }> = ({ alert }) => (
    <div
      className={`flex gap-3 p-4 rounded-lg transition-colors ${
        isDarkMode ? "bg-background-light" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start flex-shrink-0">
        {TaskTypeIcons[alert.type?.toLowerCase() as keyof typeof TaskTypeIcons]}
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div
              className={`text-sm font-medium mb-1 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {alert.title}
            </div>
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {alert.subtitle}
            </div>
          </div>
          <div
            className={`text-xs whitespace-nowrap ml-3 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {alert.time}
          </div>
        </div>
        <Button
          type="primary"
          size="small"
          onClick={() => handleAlertDone(alert.id)}
          className="self-end"
        >
          Done
        </Button>
      </div>
    </div>
  );

  // Unit Card Component
  const UnitCard: React.FC<{ unit: UnitMember }> = ({ unit }) => (
    <div
      className={`p-4 transition-colors border-b last:border-b-0 ${
        isDarkMode
          ? "bg-background border-neutral-600"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusDotColor(unit.status)}`}
          />
          <div>
            <div
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {unit.name}
            </div>
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {unit.code}
            </div>
          </div>
        </div>
        <Badge count={unit.channel} style={{ backgroundColor: "#1890ff" }} />
      </div>
      <div className="flex items-center gap-2">
        <SignalIcon
          className={getSignalColorClass(unit.signalStrength) + " size-4"}
        />
        <span className="font-sans">{unit.signalStrength}%</span>
        {getBatteryIconByStrength(unit.batteryLevel)}
        <span className="font-sans">{unit.batteryLevel}%</span>
      </div>

      <div className={`flex gap-4 pt-2`}>
        <PhoneOutlined
          className={`text-lg cursor-pointer transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-500"
          }`}
        />
        <MessageOutlined
          className={`text-lg cursor-pointer transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-500"
          }`}
        />
        <EnvironmentOutlined
          className={`text-lg cursor-pointer transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-500"
          }`}
        />
        <SearchOutlined
          className={`text-lg cursor-pointer transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-500"
          }`}
        />
      </div>
    </div>
  );

  return (
    <div
      className={`space-y-4 border-b ${
        isDarkMode ? "border-[#313337]" : "border-[#EEEFF1]"
      }`}
    >
      <Collapse
        activeKey={activeKey ?? undefined}
        onChange={(key) =>
          setActiveKey((key ?? null) as unknown as string | null)
        }
        expandIconPosition="start"
        bordered={false}
        accordion
      >
        <Panel
          header={
            <div className="flex  items-center justify-between w-full pr-4">
              <span
                className={`text-base font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Alerts
              </span>
              <div className="flex items-center gap-3">
                <Badge
                  count={`${alerts.length} Active`}
                  style={{
                    backgroundColor: "#fff0f6",
                    color: "#eb2f96",
                    border: "1px solid #ffadd2",
                  }}
                />
              </div>
            </div>
          }
          key="alerts"
          className={`rounded-lg`}
        >
          {alerts.length ? (
            <div className="flex flex-col gap-3 drop-shadow-xl">
              {alerts.map((alert: AlertItem) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No Alerts</div>
          )}
        </Panel>
        {teams.map((team: Team) => (
          <Panel
            key={team.id}
            header={
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                  <TeamOutlined
                    className={`text-lg ${
                      isDarkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <span
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {team.name}
                  </span>
                  <Badge
                    count={team.members.length}
                    style={{ backgroundColor: "#f0f0f0", color: "#595959" }}
                  />
                </div>
              </div>
            }
            className="[&_.ant-collapse-body]:!p-0"
          >
            <div
              className={`flex flex-col max-h-[260px] overflow-y-auto border-y ${isDarkMode ? "border-neutral-600" : "border-gray-200"}`}
            >
              {team.members.map((member) => (
                <UnitCard key={member.id} unit={member} />
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default AlertsAndTeams;
