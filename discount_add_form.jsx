import { useEffect, useState } from 'react'
import Select from 'react-select'

const DiscountAddForm = (props) => {
  const [discountId, setDiscountId] = useState('')
  const [productId, setProductId] = useState(null)
  const [rate_amount, setRateAmount] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [discountIdError,setDiscountIdError] = useState('')
  const [productIdError, setProductIdError] = useState(null)
  const [rate_amountError, setRateAmountError] = useState(null)
  const [startDateError, setStartDateError] = useState(null)
  const [endDateError, setEndDateError] = useState(null)
  const [dateValidation, setDateValidation] = useState(null)

  const OnSubmitHandler = () => {
    props.addNewDiscount({
      "discount_id": discountId,
      "product_id": props.updateData ? productId : productId.value,
      "rate_amount": rate_amount,
      "startDate": startDate,
      "endDate": endDate
    })
  }

  const OnUpdateHandler = () => {
    // console.log(discountId,productId,rate_amount,startDate,endDate)
    props.updateDiscount({
      "discount_id": discountId,
      "product_id": productId.value ,
      "rate_amount": rate_amount,
      "startDate": startDate,
      "endDate": endDate
    })
    props.setUpdateData();
  }

  // const checkValidation = () => {

  //   (!productId || productId.length <= 0) ? setProductIdError("Product Id is required!") : setProductIdError()
  //   !startDate ? setStartDateError("Start Date is required!") : setStartDateError()
  //   !endDate ? setEndDateError("End Date is required!") : setEndDateError()
  //   !rate_amount ? setRateAmountError("Discount amount is required!") : setRateAmountError()

  //   const today = new Date();
  //   if ((new Date(startDate)) > new Date(endDate)) {
  //     setDateValidation("Start Date and End Date are Invalid")
  //   } else if (new Date(startDate) <= today) {
  //     setDateValidation("Start Date cannot be before today")
  //   } else {
  //     setDateValidation()
  //   }
  // }

  const checkValidation = () => {
    (!productId || productId.length <= 0) ? setProductIdError("Product Id is required!") : setProductIdError("");
    !startDate ? setStartDateError("Start Date is required!") : setStartDateError("");
    !endDate ? setEndDateError("End Date is required!") : setEndDateError("");
    (!rate_amount || rate_amount < 1 || rate_amount > 100) ? setRateAmountError("Discount amount should be between 1 and 100!") : setRateAmountError("");
  
    const today = new Date();
    if (new Date(startDate) > new Date(endDate)) {
      setDateValidation("Start Date and End Date are invalid");
    } else if (new Date(startDate) <= today) {
      setDateValidation("Start Date cannot be before today");
    } else {
      setDateValidation("");
    }
  
    const startDateParts = startDate ? startDate.split("-") : [];
    const endDateParts = endDate ? endDate.split("-") : [];
  
    if (startDateParts.length !== 3 || startDateParts[0].length !== 4 || startDateParts[1].length > 2 || startDateParts[2].length > 2) {
      setStartDateError("Start Date should be in the format 'YYYY-MM-DD'.");
    } else {
      setStartDateError("");
    }
  
    if (endDateParts.length !== 3 || endDateParts[0].length !== 4 || endDateParts[1].length > 2 || endDateParts[2].length > 2) {
      setEndDateError("End Date should be in the format 'YYYY-MM-DD'.");
    } else {
      setEndDateError("");
    }
  };
  

  const OnResetHandler = () => {
    setDiscountId(null)
    setRateAmount(null)
    setEndDate(null)
    setStartDate(null)
    setProductId(null)
  }

  useEffect(() => {
    checkValidation()
  }, [discountId, productId, rate_amount, startDate, endDate])

  useEffect(() => {
    OnResetHandler()
  }, [props.isClear])

  useEffect(() => {
    if (!props.updateData) return   
    setDiscountId(props.updateData.discount_id)
    setRateAmount(props.updateData.rate_amount)
    setEndDate(props.updateData.endDate)
    setStartDate(props.updateData.startDate)
    setProductId(props.updateData.product_id)
  }, [props])


  return (
    <div className="add-discount-form">
      <div className="pd-add-form">
        <div className='pd-row'> 
        <div className="form-group">
          {props.updateData && 
          <>
          <label htmlFor="exampleInputDiscountId" >Discount Id</label>
          <input type="text" className="form-control" id="exampleInputdiscount_rate1"  value={props.updateData.discount_id}  disabled/>
          </>
          }
          

        
        </div>
          <div className="form-group">
            <label htmlFor="exampleInputProductId1">Product Id </label>
            {!props.updateData ? (
              <Select
                options={props?.productList}
                onChange={(e) => { setProductId(e) }}
                name="colors"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            ) : (
          
              <>
              <input type="text" className="form-control"  value={props.updateData.product_id.value}  disabled/>
              </>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputdiscount_rate1">Rate %</label>
            <input type="number" className="form-control" id="exampleInputdiscount_rate1" onChange={(e) => { setRateAmount(e.target.value) }} value={parseInt(rate_amount)} />
          </div> 
          <div className="form-group">
            <label htmlFor="exampleInputstart_date1">Start Date</label>
            <input type="date" className="form-control" id="exampleInputstart_date1" placeholder="start_date" onChange={(e) => { setStartDate(e.target.value) }} value={startDate} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputend_date1">End Date</label>
            <input type="date" className="form-control" id="exampleInputend_date1" placeholder="end_date" onChange={(e) => { setEndDate(e.target.value) }} value={endDate} />
          </div>
        </div>
        {console.log(props.statusMessage)}

        {props.statusMessage && (
          <div>
            {props.statusMessage?.status === "error" ? (
              <div className='pd-erro-logger'>{props?.statusMessage?.message}</div>
            ) : (
              <div className='pd-success-logger'>{props?.statusMessage?.message}</div>
            )}
          </div>
        )}
        {discountIdError || productIdError || rate_amountError || startDateError || endDateError || dateValidation ? (
          <div className='pd-erro-logger'> 
            {discountIdError}{discountIdError? <br /> : null}
            {productIdError}{productIdError ? <br /> : null}
            {rate_amountError}{rate_amountError ? <br /> : null}
            {startDateError}{startDateError ? <br /> : null}
            {endDateError}{endDateError ? <br /> : null}
            {dateValidation}{dateValidation ? <br /> : null}
          </div>
        ) : (
          <></>
        )}
        <div className="pd-row " >
          <button className="btn btn-sm btn-primary " disabled={dateValidation || discountIdError || productIdError || rate_amountError || startDateError || endDateError} onClick={() => { props.updateData ? OnUpdateHandler() : OnSubmitHandler() }}>{props?.updateData ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  )
}

export default DiscountAddForm
