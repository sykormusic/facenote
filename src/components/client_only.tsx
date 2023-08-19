import { useEffect, useState } from 'react';

export default function ClientOnly({ children, ...rest }: { children: any }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...rest}>{children}</div>;
}
