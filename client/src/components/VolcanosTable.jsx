import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
 
export default function VolcanosTable({ data }) {
    const navigate = useNavigate();
    const columns = [
        { headerName: "Name", field: "name", sortable: true, filter: true },
        { headerName: "Region", field: "region" },
        { headerName: "Subregion", field: "subregion" }
    ];
    return (
        <div  >
        <div className="ag-theme-balham" style={{ height: 400, width: 800 }}>
          <AgGridReact
            columnDefs={columns}
            rowData={data}
            pagination={true}
            onRowClicked={(row) => navigate(`/volcano/${row.data.id}`)}
          />
        </div>
      </div>
    );
}