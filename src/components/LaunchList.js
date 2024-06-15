import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunches } from "../utils/launchSlice";
import { MemoriedItems } from "./LaunchItem";
import { logout } from "../utils/authSlice";

const LaunchList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [statusFilter, setStatusFilter] = useState('');
  
  const { launches, status } = useSelector((state) => state.launch);
  
  const [displayedLaunches, setDisplayedLaunches] = useState([]);
  const [page, setPage] = useState(1);
  const launchesPerPage = 10;

  const observer = useRef();
  const lastLaunchElementRef = useCallback(node => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [status]);

  useEffect(() => {
    dispatch(fetchLaunches());
  }, [dispatch]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredLaunches = useMemo(() => {
    return launches?.filter((launch) => {
      const matchesSearchTerm = launch.mission_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesSuccess = (statusFilter ? launch.launch_success === (statusFilter === 'success') : true)
      const matchesYear = !filterYear || new Date(launch.launch_date_local).getFullYear().toString() === filterYear;

      return matchesSearchTerm && matchesSuccess && matchesYear;
    });
  }, [launches, debouncedSearchTerm, statusFilter, filterYear]);

  const years = useMemo(() => {
    return Array.from(new Set(launches?.map((launch) => new Date(launch.launch_date_local).getFullYear())));
  }, [launches]);

  useEffect(() => {
    const loadMoreLaunches = () => {
      const newLaunches = filteredLaunches.slice(0, page * launchesPerPage);
      setDisplayedLaunches(newLaunches);
    };
    loadMoreLaunches();
  }, [page, filteredLaunches]);


  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
  }

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="listContainer">
     <div className="listHead">
     <input
        type="text"
        placeholder="Search by mission name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        id="year"
        onChange={handleYearChange}
        value={filterYear}
      >
        <option value="">All Years</option>
        {years?.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
        </select>

      <button onClick={handleLogout} className="right">Logout</button>
     </div>

      <div className="listItemsContainer">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'succeeded' &&
          displayedLaunches.map((launch, index) => (
            <div
              key={launch?.flight_number + launch?.mission_name}
              ref={displayedLaunches.length === index + 1 ? lastLaunchElementRef : null}
            >
              <MemoriedItems launch={launch} />
            </div>
          ))}
          {
            (status === 'succeeded' && displayedLaunches.length === 0) && <p className="notFound">No launches found</p>
          }
        {status === 'failed' && <p>Error loading launches</p>}
      </div>
    </div>
  );
};

export default LaunchList;

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
