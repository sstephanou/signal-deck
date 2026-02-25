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
    <div className="tabs" role="tablist">
      {(["temperature", "precipitation", "wind"] as WeatherTab[]).map(
        (tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            role="tab"
            tabIndex={0}
            aria-selected={activeTab === tab}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab(tab);
              }
              // Optional: add arrow navigation
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const tabs = ["temperature", "precipitation", "wind"];
                const idx = tabs.indexOf(tab);
                let nextIdx = idx;
                if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
                if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
                setActiveTab(tabs[nextIdx] as WeatherTab);
              }
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        )
      )}
    </div>
  );
}
