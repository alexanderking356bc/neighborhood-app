import { NeighborhoodDetailsForNonMembers } from '@neighborhood/backend/src/types';
import styles from './SingleNeighborhoodPage.module.css';
import DescriptionBox from '../../components/DescriptionBox/DescriptionBox';

const NeighborhoodPageForNonMembers = (props: {
  neighborhood: NeighborhoodDetailsForNonMembers;
}) => {
  const { neighborhood } = props;

  return (
    <div className={styles.wrapper}>
      <DescriptionBox
        showJoinBtn={true}
        showEditBtn={false}
        showDeleteBtn={false}
        showLeaveBtn={false}
        showMembers={false}
        name={neighborhood.name}
        description={neighborhood.description ? neighborhood.description : ''}
      />
    </div>
  );
};

export default NeighborhoodPageForNonMembers;