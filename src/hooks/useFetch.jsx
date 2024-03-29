import { useState, useEffect } from 'react';
import getUserInfo from '../service/UseGetUser';
import getMockData from '../mockApi/mockApi';
import globalFormat from '../dataFormat';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

/**
 * This function formats API response for global formatter
 * @param {Array<Object>} data - fetched data from API
 * @returns {Array<Object>} formatted data of each charts to be globally formatted
 */

const formatApiResponse = (data) => {
  console.log(data)
  const activitySessions = data.activity.data.data.sessions;
  const performances = data.performance.data.data;
  const user = data.user.data.data;
  const averageSessions = data.averageSessions.data.data.sessions;
  return { activitySessions, performances, user, averageSessions };
};

/**
 * A hook that fetches data
 * @returns {Array<Object>} four states in a form of object to manage data, loading, data source and error
 */

export default function useFetch() {
  const { id } = useParams();
  const [searchParam] = useSearchParams();
  const apiParam = searchParam.get('api');
  const navigate = useNavigate();
  const mockData = getMockData(parseInt(id, 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('API');

  // when the page is loaded
  useEffect(() => {
    setLoading(true);

    // When user select to use mock API
    if (apiParam === 'false') {
      setDataSource('Mock Data');

      if (mockData) {
        const formattedMockData = globalFormat(mockData);
        setData(formattedMockData);
      } else {
        navigate('/Error');
      }
    } else {
      getUserInfo(id)
        .then((userInfos) => {
          // first format matched data by breakpoints
          const formatApi = formatApiResponse(userInfos);
          // then using globalFormat, format data to display charts
          const formattedData = globalFormat(formatApi);
          // then set data
          setData(formattedData);
        })
        .catch((e) => {
          // API error
          if (e.response?.status === 404 && apiParam === 'true') {
            navigate('/Error');
          }

          // API error 2
          if (e.code === 'ERR_NETWORK' && apiParam === 'true') {
            setError('API disconnected');
          }
        });
    }
    // API as data
    // get user info by id caught by useParams from URL

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, dataSource, error };
}