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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
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
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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
    setAnchorEl(event.event.target); // this is the clicked cell or row element
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
      
      {anchorEl && selectedRowData &&  (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />
          </PopoverTrigger>
          <PopoverContent
          
            side="right"
            align="start"
            style={{
              position: "absolute",
              top: anchorEl.getBoundingClientRect().top + window.scrollY,
              left: anchorEl.getBoundingClientRect().left + window.scrollX,
              pointerEvents: "auto"
            }}
          >
            <Menubar>
              <MenubarMenu>
                {/* <MenubarTrigger>Actions</MenubarTrigger> */}
                <MenubarContent>
                <MenubarItem asChild>
                    <Link href={`/tickets/form?ticketId=${selectedRowData.id}`}>
                      Edit
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link href="/tickets/form">
                      New
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
                </Menubar>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

    
    
    
    
    
    
