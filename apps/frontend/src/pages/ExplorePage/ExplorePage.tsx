import { useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader() {
  const neighborhoods: Neighborhood[] = await neighborhoodsService.getAllNeighborhoods();  
  return neighborhoods;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as {neighborhoods: Neighborhood[], currentCursor: number};

  const {neighborhoods, currentCursor} = neighborhoodsData;

  console.log(currentCursor)

  // const neighborhoodList = neighborhoods.map(neighborhood => (
  //   <li key={neighborhood.id}>{neighborhood.name}</li>
  // ));

  return <NeighborhoodSearch neighborhoods={neighborhoods}></NeighborhoodSearch>
}
