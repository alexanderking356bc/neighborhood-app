import { User } from '@neighborhood/backend/src/types';
import { Container, Row, Col } from 'react-bootstrap';
import { SetStateAction, useState, Dispatch } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './DescriptionBox.module.css';
import UserCircleStack from '../UserCircleStack/UserCircleStack';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import EditNeighborhoodModal from '../EditNeighborhoodModal/EditNeighborhoodModal';
import { FormIntent, UserRole } from '../../types';

interface PromptDetails {
  show: boolean;
  text: string;
  intent: FormIntent;
}

interface Props {
  userRole: UserRole;
  name: string;
  description: string;
  users?: Array<User> | null;
  setPromptDetails: Dispatch<SetStateAction<PromptDetails>>;
}

export default function DescriptionBox({
  userRole,
  name,
  description,
  users,
  setPromptDetails,
}: Props) {
  const usernames = users?.map((user) => user.username);
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => setShowForm(false);
  const handleShowForm = () => setShowForm(true);

  const { id: neighborhoodId } = useParams();

  function handleLeavePrompt() {
    setPromptDetails({
      show: true,
      text: 'Are you sure you want to leave this neighborhood?',
      intent: 'leave-neighborhood',
    });
  }

  function handleDeletePrompt() {
    setPromptDetails({
      show: true,
      text: 'Are you sure you want to do this? This will delete the neighborhood for you and all members!',
      intent: 'delete-neighborhood',
    });
  }

  return (
    <Container fluid className={styles.container}>
      <EditNeighborhoodModal
        show={showForm}
        handleClose={handleCloseForm}
        name={name}
        description={description}
      />
      <Row className="align-items-center gy-3">
        <Col
          xs="12"
          md="2"
          className={`${styles.membersContainer} justify-content-md-end ms-md-auto ms-3 pe-0`}>
          {userRole !== 'NON-MEMBER' ? <UserCircleStack usernames={usernames} /> : null}
          {userRole === 'MEMBER' ? (
            <FontAwesomeIcon
              icon={faDoorOpen}
              size="2xl"
              className={styles.leaveIcon}
              onClick={handleLeavePrompt}
            />
          ) : null}
        </Col>
      </Row>
      <Row className="mt-2 mt-md-4">
        <div className={styles.neighborhoodDescription}>
          {description ? <p>{description}</p> : null}
          {userRole === 'NON-MEMBER' ? (
            <TriggerActionButton
              route={`/neighborhoods/${neighborhoodId}`}
              variant="primary"
              intent="join-neighborhood"
              text="Join Neighborhood"
            />
          ) : null}
          <div className={styles.buttonsContainer}>
            {userRole === 'ADMIN' ? (
              <CustomBtn variant="outline-dark" className={styles.btn} onClick={handleShowForm}>
                Edit Neighborhood
              </CustomBtn>
            ) : null}
            {userRole === 'ADMIN' ? (
              <CustomBtn variant="danger" className={styles.btn} onClick={handleDeletePrompt}>
                Delete Neighborhood
              </CustomBtn>
            ) : null}
          </div>
        </div>
      </Row>
    </Container>
  );
}
