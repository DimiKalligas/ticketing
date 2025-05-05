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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useTheme } from "next-themes"
import Link from 'next/link'
import type { selectCustomerSchemaType } from "@/zod-schemas/customer"
import { useCallback, useMemo, useState, } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    data: selectCustomerSchemaType[],
}

export default function CustomerGrid({ data: data }: Props) {  
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  // const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { theme } = useTheme()
  const router = useRouter();
  
  ModuleRegistry.registerModules([
    PaginationModule,
    ClientSideRowModelModule,
    // ValidationModule, 
  ]);

  const displayedFields = ["firstName", "lastName", "email", "phone", "city", "zip"];    
  
  const colDefs: ColDef[] = displayedFields.map((field) => ({
    headerName: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize first letter
    field,
    filter: true,
  }));

  // Handle row click and navigate
  const onRowClicked = useCallback((event: any) => { // RowClickedEvent
    setSelectedRowData(event.data);
    setMousePosition({ x: event.event.clientX, y: event.event.clientY }); // record mouse position
    setPopoverOpen(true);
    // const recordId = event.data.id;
    // router.push(`/tickets/form?ticketId=${recordId}`); // Redirect to record page
  }, []); // router

  // να περάσει το Dark theme στον πίνακα
  const myTheme = theme === 'dark' ? themeQuartz.withPart(colorSchemeDarkWarm) : themeQuartz.withPart(colorSchemeLightCold);

  return (
    <div  style={{ height: 400, width: "100%", marginTop: 20, }}>
      <AgGridReact 
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
      
      {popoverOpen && selectedRowData &&  (
      //   <div
      //     style={{
      //       position: "absolute",
      //       top: mousePosition.y,
      //       left: mousePosition.x,
      //       zIndex: 1000,
      //     }}
      // >
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="right"
            className="animate-in fade-in zoom-in-95 border-2 border-gray-500 rounded-md bg-white shadow-md p-2"
            style={{
              position: "absolute",
              top: mousePosition.y,
              left: mousePosition.x,
              width: 101,
              transform: "translateY(8px)", // slight offset
              zIndex: 1000,
              pointerEvents: "auto",
              border: "2px solid #888", // ⬅️ extra border here
              borderRadius: "8px",      // optional: rounded corners
              backgroundColor: "white", // optional for better visibility
            }}
            avoidCollisions={false} // prevent Radix from changing your position
            >
            <div className="flex flex-col space-y-2">
              <Link href={`/customers/form?customerId=${selectedRowData.id}`} className="text-sm px-2 py-1 hover:no-underline hover:bg-sky-100">Edit</Link>
              <Link href="/tickets/form" className="text-sm px-2 py-1 hover:no-underline hover:bg-sky-100">New</Link>
            </div>
          </PopoverContent>
        </Popover>
        // </div>
      )}
    </div>
  );
}

    
    
    
    
    
    
