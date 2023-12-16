import { useLoaderData, LoaderFunctionArgs } from 'react-router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = params.cursor
    ? await neighborhoodsService.getAllNeighborhoods(Number(params.cursor))
    : await neighborhoodsService.getAllNeighborhoods();
  return data;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as {
    neighborhoods: Neighborhood[];
    currentCursor: number;
    hasNextPage: boolean;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { neighborhoods, currentCursor, hasNextPage } = neighborhoodsData;

  // const neighborhoodList = neighborhoods.map(neighborhood => (
  //   <li key={neighborhood.id}>{neighborhood.name}</li>
  // ));

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      cursor={currentCursor}
      isNextPage={hasNextPage}></NeighborhoodSearch>
  );
}
