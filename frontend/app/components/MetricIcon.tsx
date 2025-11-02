import { Box } from '@mui/material';

export type MetricIconType = 'ring' | 'briefcase' | 'cap' | 'balloon';

export default function MetricIcon({ type }: { type: MetricIconType }) {
  if (type === 'ring') {
    return (
      <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
        <circle cx="32" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M28 16h8l6 6h-20z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 12l4 4-4 4-4-4z" fill="currentColor" />
      </Box>
    );
  }
  if (type === 'briefcase') {
    return (
      <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
        <rect x="10" y="20" width="44" height="28" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M24 20v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M10 32h44" stroke="currentColor" strokeWidth="3" />
      </Box>
    );
  }
  if (type === 'cap') {
    return (
      <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
        <path d="M6 26l26-12 26 12-26 12z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M16 32v8c0 4 12 8 16 8s16-4 16-8v-8" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M58 26v14" stroke="currentColor" strokeWidth="3" />
        <circle cx="58" cy="44" r="3" fill="currentColor" />
      </Box>
    );
  }
  return (
    <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
      <path d="M32 8c8 0 14 6 14 13s-6 15-14 15-14-8-14-15 6-13 14-13z" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M32 36c0 6-4 10-8 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </Box>
  );
}

