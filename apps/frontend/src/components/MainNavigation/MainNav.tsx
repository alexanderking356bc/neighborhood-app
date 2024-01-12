import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { faBell, faCompass, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';

import styles from './MainNav.module.css';
import { getStoredUser, deleteStoredUser } from '../../utils/auth';
import UserCircle from '../UserCircle/UserCircle';

// const profilePic = require('./profile_placeholder.png');

const MainNav = () => {
  const mql = window.matchMedia('(max-width: 576px)');
  const user = getStoredUser();

  const [smallDisplay, setSmallDisplay] = useState(mql.matches);

  mql.addEventListener('change', () => {
    setSmallDisplay(mql.matches);
  });

  const Notification = () => (
    <NovuProvider
      subscriberHash={user?.hashedSubscriberId}
      subscriberId={String(user?.id)}
      applicationIdentifier={'bPm7zbb5KQz7'}>
      <PopoverNotificationCenter colorScheme={'light'}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );

  const profileIconLink = user ? (
    <Link to={`/users/${user.id}`}>
      <div className={styles.link}>
        {/* <img className={styles.profilePicture} src={profilePic} alt="User's profile" /> */}
        <UserCircle username={user.username} isLast={true} inStack={false} />
      </div>
    </Link>
  ) : null;

  const homeIconLink = (
    <Link to={'/'} title='Home'>
    <div className={styles.link}>
      <FontAwesomeIcon
        className={`${styles.navIcon} ${styles.homeIcon}`}
        icon={faHouse}
        size="xl"></FontAwesomeIcon>
    </div>
    </Link>
  );

  const exploreIconLink = (
    <Link to={'/explore'} title='Explore neighborhoods'>
      <div className={styles.link}>
        <FontAwesomeIcon
          className={`${styles.compassIcon} ${styles.navIcon}`}
          icon={faCompass}></FontAwesomeIcon>
      </div>
    </Link>
  );

  const notificationsIconLink = (
    <div className={styles.link} title='Notifications'>
      <FontAwesomeIcon
        icon={faBell}
        className={`${styles.navIcon} ${styles.bellIcon}`}></FontAwesomeIcon>
    </div>
  )

  const logoutIconLink = (
    <div className={styles.link} title='Log out'>
      <FontAwesomeIcon
        icon={faRightFromBracket}
        className={`${styles.navIcon} ${styles.logOutIcon}`}
        onClick={() => {
          deleteStoredUser();
          window.location.reload();
        }}
      />
    </div>
  );

  return (
    <>
      <Notification></Notification>
      <Navbar className={styles.nav} expand="sm">
        {smallDisplay ? (
          <>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                {user ? (
                  <Nav.Link href={`/users/${user.id}`} className={styles.navbarCollapseLink}>
                    MY PROFILE
                  </Nav.Link>
                ) : null}
                <Nav.Link href="/" className={styles.navbarCollapseLink}>
                  HOME
                </Nav.Link>
                <Nav.Link href="/explore" className={styles.navbarCollapseLink}>
                  EXPLORE
                </Nav.Link>
                <Nav.Link href="#pricing" className={styles.navbarCollapseLink}>
                  NOTIFICATIONS
                </Nav.Link>
                <Nav.Link
                  className={styles.navbarCollapseLink}
                  onClick={() => {
                    deleteStoredUser();
                    window.location.reload();
                  }}>
                  SIGN OUT
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            {profileIconLink}
            {homeIconLink}
            {exploreIconLink}
            {notificationsIconLink}
            {logoutIconLink}
          </>
        )}
      </Navbar>
    </>
  );
};

export default MainNav;
