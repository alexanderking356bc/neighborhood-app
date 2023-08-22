import styles from './DescriptionBox.module.css';
import { User } from '../../types';

interface Props {
  showJoinBtn: boolean,
  showEditBtn: boolean,
  name: string,
  description: string,
  users?: Array<User> | null
}

export default function DescriptionBox({showJoinBtn, showEditBtn, name, description, users}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.neighborhoodImg} src={require('./palm.jpeg')} alt='Neighborhood'/>
        <h1 className={styles.neighborhoodTitle}>{name}</h1>
        {showJoinBtn ? <button className={styles.button}>Join Neighborhood</button> : null}
      </div>
      <div className={styles.neighborhoodDescription}>
        <p>{description}</p>
        {users ? <p>{users.length} members</p> : null}
        {showEditBtn ? <button className={styles.editBtn}>Edit Neighborhood</button> : null}
      </div>
    </div>
  )
};

