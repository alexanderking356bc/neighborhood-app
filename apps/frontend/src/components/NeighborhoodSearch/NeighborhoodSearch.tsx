import { Form, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Neighborhood } from '@neighborhood/backend/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './NeighborhoodSearch.module.css';
import NeighborhoodCard from '../NeighborhoodCard/NeighborhoodCard';
import CustomBtn from '../CustomBtn/CustomBtn';
import neighborhoodsService from '../../services/neighborhoods';

export default function NeighborhoodSearch({
  neighborhoods,
  cursor,
  isNextPage,
}: {
  neighborhoods: Neighborhood[] | null;
  cursor: number;
  isNextPage: boolean;
}) {
  const [neighborhoodList, setNeighborhoodList] = useState(neighborhoods);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasNextPage, setHasNextPage] = useState(isNextPage);

  const neighborhoodBoxes =
    neighborhoodList?.map((neighborhood: Neighborhood) => (
      <Col className="" sm="6" md="4" lg="3" key={neighborhood.id}>
        <NeighborhoodCard
          id={neighborhood.id}
          name={neighborhood.name}
          description={neighborhood.description}
          isUserAdmin={false}></NeighborhoodCard>
      </Col>
    )) || [];

  async function fetchData() {
    const data = (await neighborhoodsService.getAllNeighborhoods(cursor)) as unknown as {
      neighborhoods: Neighborhood[];
      currentCursor: number;
      hasNextPage: boolean;
    };

    console.log(hasNextPage, typeof hasNextPage);
    // @ts-ignore
    setNeighborhoodList(neighborhoodList?.concat(data.neighborhoods));
    setHasNextPage(data.hasNextPage);
  }

  return (
    <>
      <Container className={`${styles.searchBox} mt-4 mb-5`} fluid>
        <Row className="mt-1 gy-3 justify-content-center justify-content-sm-end">
          <Col className={`mx-sm-auto ${styles.searchCol}`} lg="4" sm="6" xs="auto">
            <Form>
              <Form.Group>
                <Form.Control
                  className={styles.searchInput}
                  type="text"
                  placeholder="S e a r c h"
                  // value={searchTerm}
                  // onChange={(event) => searchNeighborhoods(event.target.value)}
                ></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col xs="auto" sm="auto" className="me-sm-4">
            <CustomBtn
              className={styles.iconBtn}
              variant="primary"
              title="Create a new neighborhood">
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </CustomBtn>
          </Col>
        </Row>
      </Container>
      <Container className={styles.neighborhoodsContainer} fluid>
        {neighborhoodBoxes.length > 0 ? (
          <InfiniteScroll
            dataLength={neighborhoodBoxes.length}
            next={fetchData}
            hasMore={hasNextPage}
            loader={<h3>Loading more neighborhoods</h3>}>
            <Row className="gy-sm-4 gx-sm-4">{neighborhoodBoxes}</Row>
          </InfiniteScroll>
        ) : (
          <Col className={styles.noNhoodsText}>
            <p>Currently, there are no neighborhoods that match your criteria.</p>
          </Col>
        )}
      </Container>
    </>
  );
}
