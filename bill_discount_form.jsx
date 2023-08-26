import { useEffect, useState } from 'react';
import Select from 'react-select';
import Axios from 'axios';

const BillDiscountForm = (props) => {
  const [billDiscount_id, setBillDiscountId] = useState(null);
  const [rate, setRate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rateAmountError, setRateAmountError] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);
  const [dateValidation, setDateValidation] = useState(null);

  const onSubmitHandler = async () => {
    props.addNewDiscount({
      billDiscount_id: billDiscount_id,
      rate,
      start_date: startDate,
      end_date: endDate
    });
  };

  const onUpdateHandler = async () => {
    props.updateDiscount({
      billDiscount_id: billDiscount_id,
      rate,
      start_date: startDate,
      end_date: endDate
    });
  };

  // const checkValidation = () => {
  //   !rate ? setRateAmountError("Discount amount is required!") : setRateAmountError(null);
  //   !startDate ? setStartDateError("Start Date is required!") : setStartDateError(null);
  //   !endDate ? setEndDateError("End Date is required!") : setEndDateError(null);
  
  //   const today = new Date();
  //   if (new Date(startDate) > new Date(endDate) && (!props.updateData || new Date(endDate) !== new Date(props.updateData.end_date))) {
  //     setDateValidation("Start Date and Expiry Date are invalid.");
  //   } else if (!props.updateData && new Date(startDate) < today) {
  //     setDateValidation("Start Date cannot be before today.");
  //   } else {
  //     setDateValidation(null);
  //   }
  // };

  const checkValidation = () => {
    if (!rate) {
      setRateAmountError("Discount amount is required!");
    } else if (rate < 1 || rate > 100) {
      setRateAmountError("Discount amount should be between 1 and 100!");
    } else {
      setRateAmountError(null);
    }
  
    !startDate ? setStartDateError("Start Date is required!") : setStartDateError(null);
    !endDate ? setEndDateError("End Date is required!") : setEndDateError(null);
  
    const today = new Date();
    if (new Date(startDate) > new Date(endDate) && (!props.updateData || new Date(endDate) !== new Date(props.updateData.end_date))) {
      setDateValidation("Start Date and Expiry Date are invalid.");
    } else if (!props.updateData && new Date(startDate) <= today) {
      setDateValidation("Start Date cannot be before today.");
    } else {
      setDateValidation(null);
    }
  
    const startDateParts = startDate ? startDate.split("-") : [];
    const endDateParts = endDate ? endDate.split("-") : [];
  
    if (startDateParts.length !== 3 || startDateParts[0].length !== 4 || startDateParts[1].length > 2 || startDateParts[2].length > 2) {
      setStartDateError("Start Date should be in the format 'YYYY-MM-DD'.");
    } else {
      setStartDateError(null);
    }
  
    if (endDateParts.length !== 3 || endDateParts[0].length !== 4 || endDateParts[1].length > 2 || endDateParts[2].length > 2) {
      setEndDateError("End Date should be in the format 'YYYY-MM-DD'.");
    } else {
      setEndDateError(null);
    }
  };
  
  

  const onResetHandler = () => {
    setRate(null);
    setEndDate(null);
    setStartDate(null);
  };

  useEffect(() => {
    checkValidation();
  }, [rate, startDate, endDate]);

  useEffect(() => {
    onResetHandler();
  }, [props.isClear]);

  useEffect(() => {
    if (!props.updateData) return;
setBillDiscountId(props.updateData.billDiscount_id)
    setRate(props.updateData.rate);
    setEndDate(props.updateData.end_date);
    setStartDate(props.updateData.start_date);
  }, [props]);

  return (
    <div className="add-discount-form">
      <div className="pd-add-form">
        <div className="pd-row">
          <div className="form-group">
            <label htmlFor="exampleInputdiscount_rate1">Rate Amount</label>
            <input
              type="number"
              className="form-control"
              id="exampleInputdiscount_rate1"
              onChange={(e) => setRate(e.target.value)}
              value={rate || ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputstart_date1">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="exampleInputstart_date1"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate || ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputend_date1">End Date</label>
            <input
              type="date"
              className="form-control"
              id="exampleInputend_date1"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate || ''}
            />
          </div>
        </div>

        {props.statusMessage ? (
          <div>
            {props.statusMessage.status === "error" ? (
              <div className='pd-erro-logger'>{props.statusMessage.message}</div>
            ) : (
              <div className='pd-success-logger'>{props.statusMessage.message}</div>
            )}
          </div>
        ) : null}

        {rateAmountError || startDateError || endDateError || dateValidation ? (
          <div className='pd-erro-logger'>
            {rateAmountError}{rateAmountError ? <br /> : null}
            {startDateError}{startDateError ? <br /> : null}
            {endDateError}{endDateError ? <br /> : null}
            {dateValidation}{dateValidation ? <br /> : null}
          </div>
        ) : null}

        <div className="pd-row">
          <button
            className="btn btn-primary btn-sm"
            disabled={dateValidation || rateAmountError || startDateError || endDateError}
            onClick={() => (props.updateData ? onUpdateHandler() : onSubmitHandler())}
          >
            {props.updateData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDiscountForm;
