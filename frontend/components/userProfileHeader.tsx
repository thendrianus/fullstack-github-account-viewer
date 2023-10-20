import type { NextPage } from 'next';
import Avatar from './avatar';

interface UserProfileHeader {
  email: string;
  name: string;
  picture: string;
}
const UserProfileHeader: NextPage<UserProfileHeader> = ({
  email = '-',
  name = '-',
  picture = '/avatar.png',
}: UserProfileHeader) => {
  return (
    <div className="py-2 px-4 flex">
      <div className=" mt-1 mr-3">
        <Avatar src={picture} width={32} height={32} />
      </div>
      <div>
        <div className=" text-sm">{name}</div>
        <div className=" text-xs text-gray-500">{email}</div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
