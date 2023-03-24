import { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import SomeRoute from "./routes/arbitrary-thing-with-query-params"


const defaultTabs = [
  { label: "first", initialUrl: "/a?1" },
  { label: "second", initialUrl: "/a?2", isActive: true },
  { label: "third", initialUrl: "/a?3", isActive: false },
];

const tabBarStyles = {
  display: "flex",
  backgroundColor: "lightgray",
  padding: "1rem",
  borderBottom: "1px black solid",
};

type TabProps = {
  label: string;
  initialUrl: string;
  isActive?: boolean;
  onClick?: (label: string, url: string) => void;
};

function Tab({ label, isActive, initialUrl, onClick }: TabProps) {
  const [url, setUrl] = useState(initialUrl);
  const location = useLocation()

  // listen for route changes
  useEffect(() => {
    // only the active tab tracks the new url
    if (isActive) setUrl(`${location.pathname}${location.search}`);
  }, [isActive, location.pathname, location.search]);

  return (
    <div
      style={{ margin: "1rem", color: isActive ? "blue" : "gray" }}
      onClick={() => {
        // notify our parent (a TabBar) that we were clicked by sharing label and url
        if (onClick) onClick(label, url);
      }}
    >
      {label}: {url}
    </div>
  );
}

function TabBar() {
  const [tabs, setTabs] = useState<Array<TabProps>>(defaultTabs);
  const navigate = useNavigate()

  // when a tab is clicked
  // update the 'isActive' attribute on all of them
  const tabOnClick = useCallback(
    (label: string, url: string) => {
      // fctn to return a new TabProps instance
      // with an updated isActive attribute
      const isActiveTab = (t: TabProps): TabProps => ({
        ...t,
        isActive: t.label === label,
      });

      // update setTabs to a new array
      // with the entries having updated isActive properties
      setTabs((tabs) => tabs.map(isActiveTab));

      // navigate the page to this url
      navigate(url);
    },
    [navigate]
  );

  return (
    <div style={tabBarStyles}>
      {tabs.map((t) => (
        <Tab
          key={t.label}
          label={t.label}
          isActive={t.isActive}
          initialUrl={t.initialUrl}
          onClick={tabOnClick}
        />
      ))}
    </div>
    );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
        <TabBar />
        <Routes>
          <Route path="/a" element={<SomeRoute />} />
          <Route path="/b" element={<SomeRoute />} />
          <Route path="/c" element={<SomeRoute />} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
)
