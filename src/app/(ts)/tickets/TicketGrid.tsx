'use client'

import { AgGridReact } from 'ag-grid-react'
import { 
  ColDef, 
  ModuleRegistry, 
  ClientSideRowModelModule, 
  ValidationModule, 
  PaginationModule, 
  themeQuartz, 
  themeMaterial,
} from 'ag-grid-community';

// import { ClientSideRowModelModule }  from "@ag-grid-community/client-side-row-model"
import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults"

type Props = {
    data: TicketSearchResultsType,
}
export default function TicketGrid({ data: data }: Props) {
    // const [gridApi, setGridApi] = useState<GridApi | null>(null);    
    ModuleRegistry.registerModules([
      PaginationModule,
      ClientSideRowModelModule,
      ValidationModule, 
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

  return (
    <div className='rounded-sm' style={{ height: 200, width: "100%", marginTop: 20, }}>
      <AgGridReact
        modules={[ClientSideRowModelModule, ValidationModule ]}
        key={data.length} // 🔹 Ensures re-render when data changes

        theme={themeMaterial}
        columnDefs={colDefs}
        rowData={data}
        pagination={true} // ✅ Ensures pagination is turned on
        paginationPageSizeSelector={[2, 5, 10]}
        paginationPageSize={5} // ✅ Sets the correct page size
        // paginationAutoPageSize={false} // ✅ Prevents auto-size adjustments
        // domLayout="autoHeight" // ✅ Allows dynamic height adjustments
        // suppressPaginationPanel={false} // ✅ Shows pagination panel
      />
    </div>
  );
}
