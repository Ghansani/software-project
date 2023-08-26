import React, { useEffect, useState } from "react";
import "./discount_style.css";
import Header from "../../SalesMgt/Header";
import POSHeader from "../../Common/POSHeader";
import BillDiscountForm from "./bill_discount_form";
import loading from "../../images/loading.gif";
import Axios from "axios";

const BillDiscountComponent = () => {
  const [isFormShow, setIsFormShow] = useState(0);
  const [discountList, setdiscountList] = useState(null);
  const [statusMessage, setStatusMessage] = useState();
  const [updateData, setUpdateData] = useState();
  const [isClear, setIsClear] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isProductFormShow, setIsProductFormShow] = useState(false);

  useEffect(() => {
    getDiscountData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setStatusMessage();
    }, 5000);
  }, [statusMessage]);

  const getDiscountData = () => {
    Axios.get("http://localhost:3001/Bill_Discount/api/getall")
      .then((response) => {
        if (response.status === 200) {
          console.log("successfully data fetched");
          setdiscountList(response.data);
        } else {
          console.log("Failed to load data");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addNewDiscount = (data) => {
    setisLoading(true);
    Axios.post("http://localhost:3001/Bill_Discount/api/", data)
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully Data Created");
          setStatusMessage({
            status: "success",
            message: "Successfully Data Created",
          });
          getDiscountData();
          setIsClear(true);
          setTimeout(() => {
            setIsFormShow(false);
          }, 2000);
        } else {
          console.log(response.data.message);
          setStatusMessage({
            status: "error",
            message: response.data.message,
          });
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  const updateDiscount = (data) => {
    setisLoading(true);

    Axios.put("http://localhost:3001/Bill_Discount/api/", data)
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully Data Updated");
          setStatusMessage({
            status: "success",
            message: "Successfully Data Updated",
          });
          getDiscountData();
          setIsClear(true);
          setTimeout(() => {
            setIsFormShow(false);
          }, 2000);
        } else {
          console.log(response.data.message);
          setStatusMessage({
            status: "error",
            message: response.data.message,
          });
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteDiscount = (data) => {
    setisLoading(true);
    Axios.delete("http://localhost:3001/Bill_Discount/api/", {
      data: data,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully Data Deleted");
          setStatusMessage({
            status: "success",
            message: "Successfully Data Deleted",
          });
          getDiscountData();
          setIsClear(true);
          setTimeout(() => {
            setIsFormShow(false);
          }, 2000);
        } else {
          console.log(response.data.message);
          setStatusMessage({
            status: "error",
            message: response.data.message,
          });
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onEditHandler = (data) => {
    setIsFormShow(false);
    setUpdateData({
      billDiscount_id: data.billDiscount_id,
      rate: data.rate,
      start_date: data.start_date,
      end_date: data.end_date,
    });

    setIsFormShow(true);
    setIsProductFormShow(true)
  };

  return (
    <>
      <div className="pd-create-new-container">
        <button
          className={
            isProductFormShow
              ? "btn btn-primary btn-sm"
              : "btn btn-primary btn-sm"
          }
          onClick={() => {
            setIsProductFormShow(!isProductFormShow);
            setIsClear(true);
          }}
        >
          {isProductFormShow ? "CLOSE FORM" : "Bill Discount"}
        </button>
      </div>
      {isProductFormShow && (
        <BillDiscountForm
          isClear={isClear}
          updateDiscount={updateDiscount}
          addNewDiscount={addNewDiscount}
          statusMessage={statusMessage}
          updateData={updateData}
        />
      )}
      <div className="pd-table-container">
        <h4> Bill Discount Details</h4>
        <table className="table table-striped pd-table">
          <thead>
            <tr>
              <th scope="col">billDiscount_id</th>
              <th scope="col">Rate</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {discountList?.map((item, index) => (
              <tr key={index}>
                <th scope="row">{item.billDiscount_id}</th>
                <td>{item.rate}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm "
                    onClick={() => onEditHandler(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      window.confirm(
                        "You want to delete discount for id " +
                          item.billDiscount_id
                      )
                        ? deleteDiscount({
                            billDiscount_id: item.billDiscount_id,
                          })
                        : null
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BillDiscountComponent;
