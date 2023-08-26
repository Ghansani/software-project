import React, { useEffect, useState } from "react";
import "./discount_style.css";
import Header from "../../SalesMgt/Header";
import POSHeader from "../../Common/POSHeader";
import DiscountAddForm from "./discount_add_form";
import loading from "../../images/loading.gif";
import Axios, { AxiosError } from "axios";
import BillDiscount from  "./BillDiscount"
import { useNavigate } from 'react-router-dom';

const DiscountComponent = () => {

  const [isFormShow, setIsFormShow] = useState(0);
  const [discountList, setdiscountList] = useState(null);
  const [statusMessage, setStatusMessage] = useState();
  const [updateData, setUpdateData] = useState();
  const [isClear, setIsClear] = useState(false);
  const [productList, setProductList] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isProductFormShow, setIsProductFormShow] = useState(false);
 

  useEffect(() => {
    getDiscountData();
    getProductList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setStatusMessage();
    }, 5000);
  }, [statusMessage]);

  

  const getDiscountData = () => {
    fetch("http://localhost:3001/Discount/api/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("successfully data fetched");
          return response.json();
        } else {
          console.log("Failed to load data");
        }
      })
      .then((data) => {
        setdiscountList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const addNewDiscount = (data) => {
    setisLoading(true);
    console.log(data);
    fetch("http://localhost:3001/Discount/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
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
          response.json().then((response) => {
            console.log(response.message);
            setStatusMessage({
              status: "error",
              message: response.message,
            });
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
    console.log(data);
  
    Axios.put("http://localhost:3001/Discount/api", data)
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
          response.json().then((response) => {
            console.log("a",response.message);
            setStatusMessage({
              status: "error",
              message: response.message,
            });
          });
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setStatusMessage({
          status: "error",
          message: error.response.data.message,
        });
        setisLoading(false);
      });
  };
  

  const deleteDiscount = (data) => {
    setisLoading(true);
    fetch("http://localhost:3001/Discount/api/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
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
          response.json().then((response) => {
            console.log(response.message);
            setStatusMessage({
              status: "error",
              message: response.message,
            });
          });
        }
        setisLoading(false);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const onEditHandler = (data) => {
    
    console.log(data)
    setIsFormShow(false);
    setUpdateData();
    setUpdateData({
      discount_id:data.discount_id,
      product_id: productList?.find((item) => item.value == data.product_id),
      rate_amount: data.rate_amount,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    setIsFormShow(true);
    setIsProductFormShow(true)

  };
  const getProductList = () => {
    fetch("http://localhost:3001/Product_Category/api/getProduct", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("successfully data fetched");
          return response.json();
        } else {
          console.log("Failed to load data");
        }
      })
      .then((data) => {
        let temp = data.map((item) => {
          return {
            value: item.product_id,
            label: item.product_id + "-" + item.product_name,
          };
        });
        setProductList(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <POSHeader title={" Discount"} />
      <div className="discount-container">
        {isLoading ? (
          <div className="loading_screen">
            <img
              src={require("../../images/loading.gif")}
              style={{ height: "100px", width: "100px" }}
            />
          </div>
        ) : (
          <>
            <div className="pd-create-new-container">
              <button
                className={
                  isProductFormShow
                    ? "btn btn-sm btn-primary"
                    : "btn btn-sm btn-primary"
                }
                onClick={() => {
                  setIsProductFormShow(!isProductFormShow);
                  setIsClear(true);
                }}
              >
                {isProductFormShow ? "CLOSE FORM" : " Product Discount"}
              </button>
            </div>
            {isProductFormShow && (
              <DiscountAddForm
                
                productList={productList}
                isClear={isClear}
                updateDiscount={updateDiscount}
                addNewDiscount={addNewDiscount}
                statusMessage={statusMessage}
                updateData={updateData}
                setUpdateData={setUpdateData}
                discountList={discountList}
              />
            )}
            <div className="pd-table-container">
              <h4> Current Discount Details</h4>
             
              <table className="table table-striped pd-table">
                <thead>
                  <tr>
                    <th scope="col">Discount_Id</th>

                    <th scope="col">Product_Id</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Action</th>

                  </tr>
                </thead>
                <tbody>
                  {discountList?.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{item.discount_id}</th> 
                      <th scope="row">{item.product_id}</th>

                      <td>{item.rate_amount}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <button  
                          className="btn btn-primary btn-sm"
                          onClick={() => onEditHandler(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            window.confirm(
                              "You want to delete discount for id " +
                                item.product_id
                            )
                              ? deleteDiscount({
                                  product_id: item.product_id,
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
              <div>
              <BillDiscount />
            </div>
            
          </>
        )}
      </div>
    </>
  );
};

export default DiscountComponent;
