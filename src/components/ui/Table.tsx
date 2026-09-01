"use client";

import { HTMLAttributes, forwardRef } from "react";

export type TableProps = HTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={`
            w-full caption-bottom text-sm
            ${className}
          `}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={`
          [&_tr]:border-b [&_tr]:border-gray-200 dark:[&_tr]:border-gray-700
          ${className}
        `}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = "TableHeader";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={`
          [&_tr:last-child]:border-0
          ${className}
        `}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = "TableBody";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={`
          [&_tr]:border-t [&_tr]:border-gray-200 dark:[&_tr]:border-gray-700
          ${className}
        `}
        {...props}
      >
        {children}
      </tfoot>
    );
  }
);

TableFooter.displayName = "TableFooter";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`
          border-b border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-800/50
          transition-colors
          ${className}
        `}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

export type TableHeadProps = HTMLAttributes<HTMLTableCellElement>;

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`
          h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400
          [&:has([role=checkbox])]:pr-0
          ${className}
        `}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = "TableHead";

export type TableCellProps = HTMLAttributes<HTMLTableCellElement>;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`
          p-4 align-middle text-gray-900 dark:text-gray-100
          [&:has([role=checkbox])]:pr-0
          ${className}
        `}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={`
          mt-4 text-sm text-gray-500 dark:text-gray-400
          ${className}
        `}
        {...props}
      >
        {children}
      </caption>
    );
  }
);

TableCaption.displayName = "TableCaption";

// Column header cell for sortable columns
export interface SortableTableHeadProps extends TableHeadProps {
  sortDirection?: "asc" | "desc" | "none";
  onSort?: () => void;
}

export function SortableTableHead({ sortDirection = "none", onSort, children, ...props }: SortableTableHeadProps) {
  return (
    <TableHead
      {...props}
      onClick={onSort}
      style={{ cursor: onSort ? "pointer" : undefined }}
      aria-sort={sortDirection !== "none" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
    >
      <div className="flex items-center gap-1">
        {children}
        {onSort && (
          <span aria-hidden="true">
            {sortDirection === "asc" && "▲"}
            {sortDirection === "desc" && "▼"}
            {sortDirection === "none" && "⇅"}
          </span>
        )}
      </div>
    </TableHead>
  );
}