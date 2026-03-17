import HeaderStyle1 from '../HeaderStyle1';
import HeaderStyle2 from '../HeaderStyle2';
import { getHeaderMenuItems } from '@/libs/headerMenu.server';

const Header = async () => {
  const menus = await getHeaderMenuItems();

    return (
        <>        
      <HeaderStyle1 menus={menus} />
        </>
  );
}

export default Header;