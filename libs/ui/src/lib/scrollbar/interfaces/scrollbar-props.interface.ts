import PerfectScrollbar from 'perfect-scrollbar';

export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollbarOptions?: PerfectScrollbar.Options;
  enabled: boolean;
}