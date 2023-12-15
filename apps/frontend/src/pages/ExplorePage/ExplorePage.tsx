import { useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader() {
  const data = await neighborhoodsService.getAllNeighborhoods();  
  return data;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as {neighborhoods: Neighborhood[], currentCursor: number};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {neighborhoods, currentCursor} = neighborhoodsData;


  // const neighborhoodList = neighborhoods.map(neighborhood => (
  //   <li key={neighborhood.id}>{neighborhood.name}</li>
  // ));

  return <NeighborhoodSearch neighborhoods={neighborhoods}></NeighborhoodSearch>
}
