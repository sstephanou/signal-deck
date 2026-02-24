import type { WeatherTab } from "../types";

interface Props {
  activeTab: WeatherTab;
  setActiveTab: (tab: WeatherTab) => void;
}

export default function WeatherTabs({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="tabs">
      {(["temperature", "precipitation", "wind"] as WeatherTab[]).map(
        (tab) => (
          <div
            key={tab}
            className={`tab ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        )
      )}
    </div>
  );
}
