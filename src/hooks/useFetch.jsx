import { useState, useEffect } from 'react';
import getUserInfo from '../service/UseGetUser';
import getMockData from '../mockApi/mockApi';
import globalFormat from '../dataFormat';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const formatApiResponse = (data) => {
  const user = data.user.data.data;
  const activitySessions = data.activity.data.data.sessions;
  const averageSessions = data.averageSessions.data.data.sessions;
  const performances = data.performance.data.data;
  return { activitySessions, performances, user, averageSessions };
};

export default function useFetch() {
  const { id } = useParams();
  const [searchParam] = useSearchParams();
  const apiParam = searchParam.get('api');
  const navigate = useNavigate();
  const mockedData = getMockData(parseInt(id, 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('API');

  useEffect(() => {
    setLoading(true);

    if (apiParam === 'false') {
      setDataSource('Mocked Data');

      if (mockedData) {
        const formattedMockData = globalFormat(mockedData);
        setData(formattedMockData);
      } else {
        navigate('/Error');
      }
      setLoading(false); // Update loading state here
    } else {
      getUserInfo(id)
        .then((userInfos) => {
          const formatApi = formatApiResponse(userInfos);
          const formattedData = globalFormat(formatApi);
          setData(formattedData);
          setLoading(false); // Update loading state here
        })
        .catch((e) => {
          if (e.response?.status === 404 && apiParam === 'true') {
            navigate('/Error');
          }

          if (e.code === 'ERR_NETWORK' && apiParam === 'true') {
            setError('API disconnected');
          }

          setLoading(false); // Update loading state here
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, dataSource, error };
}
