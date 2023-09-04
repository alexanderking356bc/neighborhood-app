import styles from './LoginForm.module.css'
import { Form, Button, Col, Container } from 'react-bootstrap';
import { Form as FormRouter, Link } from 'react-router-dom';

export default function LoginForm({ className }: {className: string}) {
    return (
      <Col lg={6} className={className}>
        <FormRouter method='post' role='form'>
          <h2>Log In</h2>
          <Form.Group className='mb-3' controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' name='username' placeholder='Your username' required />
          </Form.Group>
          <Form.Group className='mb-3' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' name='password' placeholder='Password' required />
          </Form.Group>
          <Form.Group className={`mb-3 ${styles.checkboxLinkWrapper}`} controlId='formBasicCheckbox'>
            <Container className={styles.checkboxLinkWrapper}>
              <Col><Form.Check type='checkbox' label='Remember me' /></Col>
              <Col>
                <Link to={"#"}>Forgot your password?</Link>
              </Col>
            </Container>
            {/* <Form.Check type='checkbox' label='Remember me' /> */}
            {/* <Link to={"#"}>Forgot your password?</Link> */}
          </Form.Group>
          <div className='d-grid gap-2'>
            <Button className={styles.mainBtn} variant='primary' type='submit'>
              Submit
            </Button>
            <Button variant='outline-dark' type='button' href='/signup'>
              Don't have an account? Sign up!
            </Button>
          </div>
        </FormRouter>
      </Col>
    );
}