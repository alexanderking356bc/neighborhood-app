import { Modal } from "react-bootstrap";
import { Form } from 'react-router-dom';
import styles from './RequestModal.module.css';

interface Props {
  show: boolean,
  handleClose: () => void,
}

export default function RequestModal({ show, handleClose }: Props) {
  function handleSubmit() {
    console.log('test');
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form method='post' className={styles.form} name='new-request-form'>
          <label className={styles.label} htmlFor='title'>Title:</label>
          <input className={styles.input} type='text' name='title' id='title' required minLength={4}></input>

          <label className={styles.label} htmlFor='content'>Content:</label>
          <textarea className={styles.textarea} name='content' id='content' required></textarea>

          <div className={styles.buttonContainer}>
            <input className={styles.submit} type='submit' value='Submit' 
            onSubmit={handleSubmit}></input>
            <button
              className={styles.button}
              onClick={
                (event) => {
                  event.preventDefault();
                  handleClose()
                }
              }>
              Cancel
            </button>
          </div>

        </Form>
      </Modal.Body>
    </Modal>
  )
}
