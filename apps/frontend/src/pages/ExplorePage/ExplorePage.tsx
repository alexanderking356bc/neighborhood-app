import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router-dom';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  console.log(params);
  const data = await neighborhoodsService.getAllNeighborhoods();  
  return data;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as {neighborhoods: Neighborhood[], currentCursor: number};
  const fetcher = useFetcher();
  fetcher.load(`/explore/13`)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {neighborhoods, currentCursor} = neighborhoodsData;


  // const neighborhoodList = neighborhoods.map(neighborhood => (
  //   <li key={neighborhood.id}>{neighborhood.name}</li>
  // ));

  return <NeighborhoodSearch neighborhoods={neighborhoods}></NeighborhoodSearch>
}
