import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Card, CircularProgress } from "@material-ui/core";
import moment from "moment";

import axios from "../../utils/axios";

export default function Orders() {
  const history = useHistory();
  const isAuth = useSelector(({ auth }) => auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { docs },
        } = await axios.get("/api/orders");
        setLoading(false);
        setOrders(docs);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    if (!token) {
      history.push("/");
    } else if (isAuth) {
      getData();
    }
    // eslint-disable-next-line
  }, [isAuth]);

  return (
    <Card className="mb-5">
      <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-4">
        <div>
          <h6 className="font-weight-bold font-size-lg mb-1 text-black">Mis Trámites</h6>
          <p className="text-black-50 mb-0">Estos son los trámites que tenemos bajo tu usuario</p>
        </div>
      </div>
      <div className="divider" />
      <div className="divider" />

      <div className={clsx("tab-item-wrapper", { active: true })} index={1}>
        <div className="pl-3">
          <div className="shadow-overflow">
            <div className="timeline-list timeline-list-offset timeline-list-offset-dot py-3">
              {loading ? (
                <CircularProgress color="secondary" />
              ) : (
                orders.map((item) => {
                  return (
                    <div className="timeline-item" key={item._id} style={{ textDecoration: "none" }}>
                      <Link to={`procedure/${item._id}`}>
                        <div className="timeline-item-offset">{moment(item.createdAt).format("DD MMM")}</div>
                        <div className="timeline-item--content">
                          <div className="timeline-item--icon" />
                          <h4 className="timeline-item--label mb-2 font-weight-bold">
                            <div className="badge badge-success">{item.bpmn._nameSchema}</div>
                          </h4>
                          <p>Aqui va una descripción</p>
                        </div>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
