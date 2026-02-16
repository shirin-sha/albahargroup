'use client';

import { usePathname } from 'next/navigation';
import HeaderStyle1 from '../HeaderStyle1';
import HeaderStyle2 from '../HeaderStyle2';

const Header = () => {
    const pathname = usePathname();

    // Hide header on admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>        
          <HeaderStyle1 />
        </>
    )
}

export default Header;