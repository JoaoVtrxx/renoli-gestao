import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

type TableProps = HTMLAttributes<HTMLTableElement>;
type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ ...props }: TableProps) {
  return (
    <table className="w-full text-sm text-left" {...props} />
  );
}

export function TableHeader({ ...props }: TableHeaderProps) {
  return (
    <thead className="text-xs text-muted-foreground-light uppercase bg-background-light" {...props} />
  );
}

export function TableBody({ ...props }: TableBodyProps) {
  return (
    <tbody {...props} />
  );
}

export function TableRow({ ...props }: TableRowProps) {
  return (
    <tr className="border-b border-border-light hover:bg-background-light" {...props} />
  );
}

export function TableHead({ ...props }: TableHeadProps) {
  return (
    <th className="px-6 py-3" {...props} />
  );
}

export function TableCell({ ...props }: TableCellProps) {
  return (
    <td className="px-6 py-4" {...props} />
  );
}