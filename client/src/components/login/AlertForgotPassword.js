import { Toast, Row, Col } from 'react-bootstrap';

function AlertForgotPassword(props) {

  return (
    <>
      <Row className="alertForgot ml-3 mt-3 h-3" >
        <Col xs={13}>
          <Toast onClose={() => props.setShow(false)} show={props.show} delay={10000} autohide>
            <Toast.Header>
              <img
                className="rounded mr-3"
                alt=""
              />
              <strong className="mr-auto">Go to your email!!!</strong>
            </Toast.Header>
            <Toast.Body>There you can choose an alternative password</Toast.Body>
          </Toast>
        </Col>
      </Row>
    </>
  );
}
export default AlertForgotPassword;