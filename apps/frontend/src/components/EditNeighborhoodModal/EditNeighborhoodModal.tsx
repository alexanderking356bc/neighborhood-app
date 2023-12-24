import { Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { useParams, useSubmit } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import styles from './EditNeighborhoodModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';

interface Props {
  show: boolean;
  handleClose: () => void;
  name: string;
  description: string;
  location: SearchResult | null;
}

export default function EditNeighborhoodModal({
  show,
  handleClose,
  name,
  description,
  location,
}: Props) {
  const validInputPattern = /\s*(\S\s*){4,}/;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const [locationInput, setLocationInput] = useState<Option | null>(location);
  const [textAreaInput, setTextAreaInput] = useState(description);

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<SearchResult[]>([]);

  const { id: neighborhoodId } = useParams();
  const submit = useSubmit();
  const closeModal = () => {
    handleClose();
    setNameInput(name);
    setTextAreaInput(description);
  };

  const provider = new OpenStreetMapProvider();

  function validateInput() {
    return validInputPattern.test(nameInput);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      name,
      location: locationInput ? JSON.stringify(locationInput) : textAreaInput,
      description: textAreaInput,
      intent: 'edit-neighborhood',
    };
    setFormSubmitted(true);

    if (!form.checkValidity() || !validateInput()) {
      event.stopPropagation();
    } else {
      submit(data, {
        method: 'put',
        encType: 'application/x-www-form-urlencoded',
        action: `/neighborhoods/${neighborhoodId}`,
      });
      handleClose();
      setFormSubmitted(false);
    }
  };

  const handleLocationSearch = async (query: string) => {
    setIsLoading(true);
    const results = await provider.search({ query });
    setOptions(results);
    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={closeModal} animation={true} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Neighborhood</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form role="form" noValidate onSubmit={handleSubmit} className={styles.createReqForm}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label column="sm">
              Title<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={nameInput}
              minLength={4}
              maxLength={30}
              isInvalid={!validInputPattern.test(nameInput) && formSubmitted}
              isValid={validInputPattern.test(nameInput)}
              onChange={(event) => {
                setNameInput(event?.target.value);
                setFormSubmitted(false);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="location">
            <Form.Label column="sm">
              Location<span className={styles.asterisk}>*</span>
            </Form.Label>
            <AsyncTypeahead
              id="location-search"
              filterBy={() => true}
              isLoading={isLoading}
              onSearch={handleLocationSearch}
              options={options}
              onChange={(option) => setLocationInput(option[0])}
              placeholder=""
              // labelKey={} ?????
              // isInvalid={!validInputPattern.test(nameInput) && formSubmitted}
              // isValid={validInputPattern.test(nameInput)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="description">
            <Form.Label column="sm">
              Description<span className={styles.asterisk}>*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="description"
              value={textAreaInput}
              onChange={(event) => {
                setTextAreaInput(event?.target.value);
                setFormSubmitted(false);
              }}
            />
            <Form.Control.Feedback type="invalid">
              The description needs to be at least 4 characters long.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Text className="text-muted">
              Fields marked with <span className={styles.asterisk}>*</span> are required.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control type="hidden" name="intent" value="edit-neighborhood" />
          </Form.Group>
          <Container className={styles.btnContainer} fluid>
            <Row className="gx-3 gy-2">
              <Col sm={6}>
                <CustomBtn variant="primary" type="submit" className={`${styles.btn}`}>
                  Submit
                </CustomBtn>
              </Col>
              <Col sm={6}>
                <CustomBtn variant="outline-dark" onClick={closeModal} className={styles.btn}>
                  Cancel
                </CustomBtn>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
