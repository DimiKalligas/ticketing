'use client'

import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css' // optionalimport {

import { ModuleRegistry, ClientSideRowModelModule, themeQuartz, themeMaterial,} from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults"

type Props = {
    data: TicketSearchResultsType,
}

export default function TicketGrid({ data }: Props) {
    const [rowData] = useState(data)
    console.log('Data received:', data);
    
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
    
    ModuleRegistry.registerModules([
        ClientSideRowModelModule,
    ]);
    return (
        // Data Grid will fill the size of the parent container
        // style={{ height: 500 }}
        // <div className='ag-theme-alpine'>
            <div className="mt-6 flex flex-col gap-4">
            <div className="rounded-lg overflow-hidden border border-border h-80" style={{ height: 400, width: "100%" }}>
            <AgGridReact
                theme={themeMaterial}
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={10}
                // paginationPageSizeSelector={[2, 4]}

            />
        </div>
        </div>

    )
}