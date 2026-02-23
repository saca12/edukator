import { Box } from '@radix-ui/themes';

// On crée le composant manuellement ici
export const DecorativeBox = ({ height = '100px', ...props }) => (
  <Box
    {...props}
    style={{
      backgroundColor: 'var(--gray-a3)',
      borderRadius: 'var(--radius-3)',
      border: '1px dashed var(--gray-a7)',
      height: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...props.style
    }}
  />
);