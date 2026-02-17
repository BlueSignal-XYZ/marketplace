/**
 * Design System Primitives — barrel export.
 *
 * Usage:
 *   import { Button, Input, Badge, Table, DataCard } from '../design-system/primitives';
 */

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input } from './Input';
export type { InputProps, InputSize } from './Input';

export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { ToastContainer } from './Toast';
export type { ToastContainerProps, ToastItemProps } from './Toast';

export { Skeleton, SkeletonCircle, SkeletonText, SkeletonCard } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Table } from './Table';
export type { TableProps, Column, SortDir } from './Table';

export { DataCard } from './DataCard';
export type { DataCardProps } from './DataCard';

export { TimeSeriesChart, Sparkline } from './Chart';
export type { TimeSeriesChartProps, ChartDataset, SparklineProps } from './Chart';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Tabs } from './Tabs';
export type { TabsProps, Tab } from './Tabs';

export { SearchBar } from './SearchBar';
export type { SearchBarProps, FilterConfig, FilterOption } from './SearchBar';

export { FilterChips } from './FilterChips';
export type { FilterChipsProps, ChipOption } from './FilterChips';

export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl';

export { ComingSoon } from './ComingSoon';
export type { ComingSoonProps } from './ComingSoon';
