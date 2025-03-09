'use client'

import { AgGridReact } from 'ag-grid-react'
import { 
  ColDef, 
  ModuleRegistry, 
  ClientSideRowModelModule, 
  ValidationModule, 
  PaginationModule, 
  themeQuartz, 
  colorSchemeDarkWarm,
  colorSchemeLightCold,
} from 'ag-grid-community';
import { useTheme } from "next-themes"

import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults"
import { useMemo } from 'react';

type Props = {
    data: TicketSearchResultsType,
}

export default function TicketGrid({ data: data }: Props) {  
  const { theme } = useTheme()


    ModuleRegistry.registerModules([
      PaginationModule,
      ClientSideRowModelModule,
      // ValidationModule, 
    ]);
 
    const displayedFields = ["ticketDate", "title", "tech", "firstName", "lastName", "email", "completed"];    
  
    const colDefs: ColDef[] = displayedFields.map((field) => ({
      headerName: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize first letter
      field,
      valueFormatter: (params) => {
        if (field === "completed") return params.value ? "✅ Yes" : "❌ No"; // Format boolean
        if (field === "ticketDate") return new Date(params.value).toLocaleDateString(); // Format date
        return params.value;
      },
    }));

    const rowSelection = useMemo(() => { 
      return {
            mode: 'singleRow'
        };
    }, []);
    console.log('theme:', theme);
    
    const myTheme = theme === 'dark' ? themeQuartz.withPart(colorSchemeDarkWarm) : themeQuartz.withPart(colorSchemeLightCold);
    // themeQuartz.withPart(colorSchemeDark);
    // theme === 'dark' ? themeQuartz.overrides = colorSchemeDark : themeQuartz.overrides = null;

  return (
    <div  style={{ height: 400, width: "100%", marginTop: 20, }}>
      <AgGridReact
        // modules={[ClientSideRowModelModule, ValidationModule ]} πως και δεν τα χρειάζεται??...
        key={data.length} // 🔹 Ensures re-render when data changes

        theme={myTheme}
        columnDefs={colDefs}
        rowData={data}
        pagination={true} // ✅ Ensures pagination is turned on
        paginationPageSizeSelector={[2, 5, 10]}
        paginationPageSize={5} // ✅ Sets the correct page size

        rowSelection={rowSelection}
        // paginationAutoPageSize={false} // ✅ Prevents auto-size adjustments
        // domLayout="autoHeight" // ✅ Allows dynamic height adjustments
        // suppressPaginationPanel={false} // ✅ Shows pagination panel
      />
    </div>
  );
}
