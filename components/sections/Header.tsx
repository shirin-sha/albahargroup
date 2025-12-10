'use client';

import { usePathname } from 'next/navigation';
import HeaderStyle1 from '../HeaderStyle1';
import HeaderStyle2 from '../HeaderStyle2';

const Header = () => {
    const pathname = usePathname();

    return (
        <>        
            {pathname == '/home-2' ? <HeaderStyle2 /> : <HeaderStyle1 />}
        </>
    )
}

export default Header;