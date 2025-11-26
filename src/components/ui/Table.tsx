import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

type TableProps = HTMLAttributes<HTMLTableElement>;
type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ ...props }: TableProps) {
  return (
    <table className="w-full text-base text-left" {...props} />
  );
}

export function TableHeader({ ...props }: TableHeaderProps) {
  return (
    <thead className="text-sm font-semibold text-muted uppercase bg-background-light" {...props} />
  );
}

export function TableBody({ ...props }: TableBodyProps) {
  return (
    <tbody {...props} />
  );
}

export function TableRow({ ...props }: TableRowProps) {
  return (
    <tr className="border-b border-border hover:bg-background-light" {...props} />
  );
}

export function TableHead({ ...props }: TableHeadProps) {
  return (
    <th className="px-6 py-5" {...props} />
  );
}

export function TableCell({ ...props }: TableCellProps) {
  return (
    <td className="px-6 py-5" {...props} />
  );
}