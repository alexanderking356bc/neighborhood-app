import SearchFilterForm from "../SearchFilterForm/SearchFilterForm";
import Request from "../Request/Request";
import CreateRequestModal from "../CreateRequestModal/CreateRequestModal";
import styles from "./RequestBox.module.css";
import { RequestType } from "../../types";
import { useState } from "react";

//@ts-ignore
export default function RequestBox({ requests }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [requestsType, setRequestsType] = useState("open");
  const [requestSearchValue, setRequestSearchValue] = useState("");

  let requestSelection;

  if (requestsType === "open") {
    requestSelection = requests.filter((request: RequestType) => {
      return request.status === "OPEN";
    });
  } else if (requestsType === "closed") {
    requestSelection = requests.filter((request: RequestType) => {
      return request.status === "CLOSED";
    });
  } else if (requestsType === "all") {
    requestSelection = requests;
  }

  if (requestSearchValue !== "") {
    requestSelection = requestSelection.filter((request: RequestType) => {
      return request.title.toLowerCase().includes(requestSearchValue.toLowerCase());
    });
  }

  const requestBoxes = requestSelection.map((request: RequestType) => {
    return <Request requestObj={request} key={request.id}></Request>;
  });

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Neighborhood Requests</h2>
      <button className={styles.button} onClick={handleShow}>
        Create request
      </button>
      <div className={styles.form}>
        <SearchFilterForm
          filterStatus={requestsType}
          setFilterStatus={setRequestsType}
          requestSearchValue={requestSearchValue}
          setRequestSearchValue={setRequestSearchValue}
        />
      </div>
      <CreateRequestModal show={show} handleClose={handleClose} />
      <div className={styles.container}>
        {requestBoxes}
      </div>
    </div>
  );
}