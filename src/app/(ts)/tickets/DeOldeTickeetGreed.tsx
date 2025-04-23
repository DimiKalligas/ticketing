'use client'

import { useRef, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'
import type { AgGridReactProps } from "ag-grid-react";
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css' // optionalimport {

import { 
    ModuleRegistry, 
    ClientSideRowModelModule, 
    themeQuartz, 
    // themeMaterial, 
    // themeBalham,
    // provideGlobalGridOptions, 
} from 'ag-grid-community';
import { ColDef, GridApi, GridReadyEvent, } from 'ag-grid-community';
import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults"

type Props = {
    data: TicketSearchResultsType,
}

export default function TicketGrid({ data }: Props) {
    // const gridRef = useRef<AgGridReactProps | null>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const containerStyle = useMemo(() => ({ width: "100%", height: "700px", marginTop: "1em", }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData] = useState(data)
    const [gridData, setGridData] = useState([]);

    const handleGridReady = (params: GridReadyEvent) => {
        console.log("AG Grid Ready - API Available:", params.api);
        setGridApi(params.api);
    // console.log('Data received:', data);
    // 🔹 Ensure pagination API is available AFTER setting state
    setTimeout(() => {
        if (params.api) {
            console.log("Pagination Active:", params.api.paginationGetRowCount());
            console.log("Total Pages:", params.api.paginationGetTotalPages());
            console.log("Page Size:", params.api.paginationGetPageSize());
        } else {
            console.error("AG Grid API is still unavailable.");
        }
        }, 500); // ✅ Wait 100ms to let AG Grid initialize fully
    };
    // // to use myTheme in an application, pass it to the theme grid option
    // const myTheme = themeQuartz
    //     .withParams({
    //         browserColorScheme: "light",
    //         headerFontSize: 14
    //     });

    const displayedFields = ["ticketDate", "title", "tech", "firstName", "lastName", "email", "completed"];    
    // const colDefs = Object.keys(tickets.shape)
    // // .filter((key) => displayedFields.includes(key)) // Keep only selected fields
    // .map((key) => ({
    //     headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column names
    //     field: key,
    //   }));
    //   console.log(colDefs);
    const colDefs: ColDef[] = displayedFields.map((field) => ({
        headerName: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize first letter
        field,
        valueFormatter: (params) => {
          if (field === "completed") return params.value ? "✅ Yes" : "❌ No"; // Format boolean
          if (field === "ticketDate") return new Date(params.value).toLocaleDateString(); // Format date
          return params.value;
        },
      }));
    
    // provideGlobalGridOptions({ theme: "legacy" });

    ModuleRegistry.registerModules([
        ClientSideRowModelModule,
    ]);
    return (
        // Data Grid will fill the size of the parent container
        // style={{ height: 500 }}
        // <div className='ag-theme-alpine'>
            <div className="mt-6 flex flex-col gap-4">
            {/* // <div style={containerStyle}> */}
            {/* className="ag-theme-alpine" */}
            <div className="ag-theme-alpine" style={{ height: 600, width: "100%", marginTop: "20px" }}>
                {/* <div style={gridStyle}> */}
                {/* <div className="rounded-lg overflow-hidden border border-border h-80" style={{ height: 400, width: "100%" }}> */}
                    <AgGridReact
                    modules={[ClientSideRowModelModule]
        // ref={gridRef}
        key={data.length} // 🔹 This forces reinitialization when data changes
        columnDefs={[
            { headerName: "Title", field: "title" },
            { headerName: "Tech", field: "tech" },
            { headerName: "Created At", field: "createdAt" },
            { headerName: "First Name", field: "firstName" },
            { headerName: "Last Name", field: "lastName" },
            { headerName: "Email", field: "email" },
            { headerName: "Completed", field: "completed" },
        ]}
        rowData={data}
        pagination={true}
        paginationPageSize={4}
        paginationAutoPageSize={false} // ✅ Prevents auto-size adjustments
        domLayout="autoHeight" // ✅ Allows dynamic height adjustments
        suppressPaginationPanel={false} // ✅ Shows pagination panel
        onGridReady={handleGridReady}
        // theme={themeQuartz}
        // rowData={rowData}
        // columnDefs={colDefs}
        // pagination={true}
        // paginationPageSize={4}
        // // paginationAutoPageSize={false} // Ensure manual page size is applied
        // domLayout="autoHeight"
        // paginationAutoPageSize={false} // ✅ Forces pagination controls to appear
        // suppressPaginationPanel={false} // Ensures pagination buttons are visible
        // paginationPageSizeSelector={[2, 4]}
                    />
                </div>
            </div>

    )
}