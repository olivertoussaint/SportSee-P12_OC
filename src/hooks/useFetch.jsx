import { useEffect, useState } from 'react';
import getUserInfo from '../service/UseGetUser';
import getMockDataApi from '../mockApi/mockApi';
import globalFormat from '../dataFormat';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const formatApiResponse = (data) => {
  const activitySessions = data.activity.data.data.sessions;
  const performances = data.performance.data.data;
  const user = data.user.data.data;
  const averageSessions = data.averageSessions.data.data.sessions;
  return { activitySessions, performances, user, averageSessions };
};

function useFetch() {
  const { id } = useParams();
  const [searchParam] = useSearchParams();
  const apiParam = searchParam.get('api');
  const navigate = useNavigate();
  const mockData = getMockDataApi(parseInt(id, 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('API');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (apiParam === 'false') {
        setDataSource('Mock Data');

        if (mockData) {
          const formattedMockData = globalFormat(mockData);
          setData(formattedMockData);
        } else {
          navigate('/Error');
        }
      } else if (apiParam === 'true') {
        try {
          const userInfos = await getUserInfo(id);
          const formatApi = formatApiResponse(userInfos);
          const formattedData = globalFormat(formatApi);
          setData(formattedData);
        } catch (e) {
          if (e.response?.status === 404) {
            navigate('/Error');
          }
          if (e.code === 'ERR_NETWORK') {
            setError('API disconnected');
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, apiParam, navigate]); // Ajout de mockData et navigate dans les dépendances

  return { data, loading, dataSource, error };
}

export default useFetch;
