'use client'

import { AgGridReact } from 'ag-grid-react'
import { 
  ColDef, 
  ModuleRegistry, 
  ClientSideRowModelModule, 
  // ValidationModule, 
  PaginationModule, 
  themeQuartz, 
  colorSchemeDarkWarm,
  colorSchemeLightCold,
  RowClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { useTheme } from "next-themes"

import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults"
import type { selectTicketSchemaType } from '@/zod-schemas/ticket';
import { useCallback, useMemo, } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type Props = {
  data: selectTicketSchemaType,
  // data: TicketSearchResultsType,
}

export default function TicketGrid({ data: data }: Props) {  
  const { theme } = useTheme()
  const router = useRouter();
  const { getPermission, isLoading } = useKindeBrowserClient()
      
  // // isManager could be Admin also
  const isManager = !isLoading && getPermission('manager')?.isGranted
            
  ModuleRegistry.registerModules([
    PaginationModule,
    ClientSideRowModelModule,
    // ValidationModule, 
  ]);
  
  const displayedFields = ["ticketDate", "title", "tech", "firstName", "lastName", "email", "completed"];    
  
  // const defaultColDef = useMemo(() => {
  //   return {
  //     flex: 1,
  //     minWidth: 150,
  //     filter: "agTextColumnFilter",
  //     suppressHeaderMenuButton: true,
  //     suppressHeaderContextMenu: true,
  //   };
  // }, []);

  // Function to return different cell renderers for specific fields
  const getCellRenderer = (field: string) => {
    switch (field) {
      case "completed":
        return (params: ICellRendererParams) =>
          params.value === true || params.value === "true" ? "✅ Yes" : "❌ No";

      case "priority":
        return (params: ICellRendererParams) => {
          const color = params.value === "High" ? "red" : params.value === "Medium" ? "orange" : "green";
          return `<span style="color: ${color}; font-weight: bold;">${params.value}</span>`;
        };

      case "ticketDate":
        return (params: ICellRendererParams) =>
          params.value ? new Date(params.value).toLocaleDateString() : "N/A";

      default:
        return undefined; // No custom renderer for other fields
    }
  }

  const colDefs: ColDef[] = displayedFields.map((field) => ({
    headerName: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize first letter
    field,
    filter: true,
    // cellRenderer: field === "completed"
    //   ? (params: ICellRendererParams) => {
    //       // console.log("CellRenderer Params:", params);
    //       const isCompleted = params.value === true || params.value === "true"; // ✅ Convert possible string to boolean
    //       return isCompleted ? "✅ Yes" : "❌ No";
    //     }
    //   : undefined, // No renderer for other fields
      cellRenderer: getCellRenderer(field), 
  }));
  
   
  // Handle row click and navigate
  const onRowClicked = useCallback((event: RowClickedEvent) => {
    const recordId = event.data.id;
    router.push(`/tickets/form?ticketId=${recordId}`); // Redirect to record page
  }, [router]);

  // να περάσει το Dark theme στον πίνακα
  const myTheme = theme === 'dark' ? themeQuartz.withPart(colorSchemeDarkWarm) : themeQuartz.withPart(colorSchemeLightCold);

  return (
    <>
      {isManager ? (<p className='mt-5'>Είστε συνδεδεμένος</p>) : null}
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

          rowSelection='single'
          onRowClicked={onRowClicked} 
          // defaultColDef={defaultColDef}
        />
      </div>
    </>
  );
}
