import { useEffect, useState } from "react";
import "./AdminPage.css";

function AdminPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("https://four0-mak-server-3.onrender.com/logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
        }
      })
      .catch((err) => console.error("Xatolik:", err));
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1>Qurilmalar ro‘yxati</h1>
        <p>Sizning tizimingizga ulangan barcha qurilmalar ro‘yxati</p>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>IP</th>
                <th>Model</th>
                <th>Rasm</th>
                <th>Ulangan vaqt</th>
                <th>Hisob</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td>{log.ip}</td>
                  <td>{log.model}</td>
                  <td>
                    <img
                      src={log.image}
                      alt={log.model}
                      className="device-img"
                    />
                  </td>
                  <td>{new Date(log.connectedAt).toLocaleString()}</td>
                  <td>{log.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
