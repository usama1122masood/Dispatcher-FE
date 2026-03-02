import React, { useEffect } from "react";
import { ConfigProvider, type ThemeConfig } from "antd";
import AppRoutes from "./routes";
import "./App.css";
import { useAppSelector } from "./store/hooks";
import { selectIsDarkMode } from "./store/slices/Themeslice";

const App: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  useEffect(() => {
    console.log({ isDarkMode });
  }, [isDarkMode]);
  const darkTheme: ThemeConfig = {
    cssVar: {
      prefix: "ant",
    },
    token: {
      colorPrimary: "#C1DFFB",
      borderRadius: 6,
      colorText: "#FFFFFF",
      colorTextSecondary: "#888",
      colorBorderSecondary: "#313337",
      colorBgBase: "#141414",
      colorBorder: "#313337",
      colorIcon: "#FFFFFF",
      colorBgContainer: "#141414",
      colorBgElevated: "#222222",
      colorTextDescription: "#FFFFFF",
      colorTextPlaceholder: "#888",
      colorSuccessBg: "#141414",
      colorWarningBg: "#141414",
      colorErrorBg: "#141414",
      colorInfoBg: "#141414",
      colorTextDisabled: "#555",
      colorPrimaryText: "#000",
    },
    components: {
      Button: {
        primaryColor: "#000",
        primaryShadow: "none",
      },
      Layout: {
        headerBg: "#ff0000",
      },
      Slider: {
        handleColor: "#BFBFBF",
        handleSize: 12,
        trackBg: "black",
        railBg: "#BFBFBF",
        railHoverBg: "#BFBFBF",
        colorBgElevated: "black",
        trackHoverBg: "black",
      },
      Divider: {
        colorSplit: "#374151",
        marginLG: 0,
      },
      Select: {
        optionSelectedBg: "#374151",
        colorBgSpotlight: "#f00",
      },
      Tabs: {
        cardBg: "#222222",
        colorBorderSecondary: "#444",
        itemSelectedColor: "white",
        itemHoverColor: "white",
      },
      Collapse: {
        headerBg: "#141414",
      },
      Card: {
        colorBgContainer: "#333333",
        bodyPadding: 8,
      },
      Menu: {
        itemSelectedColor: "#222",
      },
    },
  };
  const lightTheme: ThemeConfig = {
    cssVar: {
      prefix: "ant",
    },
    token: {
      colorPrimary: "#0B5DAA",
      borderRadius: 6,
      colorText: "#000000",
      colorTextPlaceholder: "#888",
      colorIcon: "#000000",
      colorPrimaryText: "#fff",
    },
    components: {
      Slider: {
        handleColor: "black",
        handleSize: 12,
        trackBg: "black",
        railBg: "#BFBFBF",
        railHoverBg: "#BFBFBF",
        trackHoverBg: "black",
        handleActiveColor: "#555",
      },
      Divider: {
        colorSplit: "#E5E7EB",
        marginLG: 0,
      },
      Card: {
        colorBgContainer: "#ddd",
        bodyPadding: 8,
      },
    },
  };
  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
