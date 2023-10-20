import type { NextComponentType, NextPage } from 'next';
import Avatar from './avatar';
import { EnvelopeIcon, UsersIcon, EyeIcon } from '@heroicons/react/20/solid';
import {
  selectGithubAccountState,
  VisitorInterface,
} from '@/store/githubAccountSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  login: string;
  username: string;
  avatar_url: string;
}
const ProfileHeader: NextPage<ProfileHeaderProps> = ({
  login = '',
  username = '',
  avatar_url,
}) => {
  return (
    <>
      {/* Mobile */}
      <div className="pt-10 lg:hidden flex">
        <Avatar src={avatar_url} height={80} width={80} />
        <div className="ml-5">
          <div className="mt-4 text-lg font-semibold">{username}</div>
          <div className="tex-xs font-light text-gray-700">@{login}</div>
        </div>
      </div>

      {/* Desktop */}
      <div className="pt-10 text-center hidden lg:block">
        <Avatar src={avatar_url} height={160} width={160} />
        <div>
          <div className="mt-2 text-lg font-semibold">{username}</div>
          <div className="tex-xs font-light text-gray-700">@{login}</div>
        </div>
      </div>
    </>
  );
};

interface ProfileAboutProps {
  bio: string;
  email: string;
  totalVisit: number;
  following: number;
  followers: number;
}
const ProfileAbout: NextPage<ProfileAboutProps> = ({
  bio = '-',
  email = '',
  totalVisit = 0,
  following = 0,
  followers = 0,
}: ProfileAboutProps) => {
  return (
    <>
      <div className="my-5">
        <div className="mb-2">
          <b>About</b>
        </div>
        <div>{bio}</div>
      </div>
      <div>
        {email ? (
          <div className="flex mb-1">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            {email}
          </div>
        ) : (
          ''
        )}

        <div className="flex">
          <UsersIcon className="h-5 w-5 mr-2" />
          <b>{followers}</b>&nbsp;follower&nbsp;&nbsp;
          <b>{following}</b>&nbsp;following
        </div>
        <div className="flex">
          <EyeIcon className="h-5 w-5 mr-2" />
          <b>{totalVisit}</b>&nbsp;profile visitor
        </div>
      </div>
    </>
  );
};
type ProfileLatestVisitorProps = {
  children: React.ReactNode; // 👈️ type children
};

const ProfileLatestVisitor: NextPage<ProfileLatestVisitorProps> = ({
  children,
}: ProfileLatestVisitorProps) => {
  return (
    <div className="my-5">
      <div className="mb-3">
        <b>Latest Visitor</b>
      </div>
      <div className="flex gap-x-2">{children}</div>
    </div>
  );
};

const Sidemenu: NextComponentType = () => {
  const router = useRouter();
  const githubAccountState = useSelector(selectGithubAccountState);
  const {
    avatar_url,
    bio,
    followers,
    email,
    following,
    login,
    name,
    totalVisit,
    visitors,
  } = githubAccountState.profile;

  const latestVisitors = visitors.map(
    (visitor: VisitorInterface, idx: number) => {
      return (
        <Avatar
          handleClick={() => {
            router.push(`/${visitor.VisitorUsername}`);
          }}
          key={idx}
          cursor={true}
          src={visitor.VisitorAvatar}
        />
      );
    },
  );
  return (
    <div>
      <ProfileHeader login={login} username={name} avatar_url={avatar_url} />
      <ProfileAbout
        bio={bio}
        email={email}
        totalVisit={totalVisit}
        followers={followers}
        following={following}
      />
      {
        visitors.length > 0 ? <ProfileLatestVisitor>{latestVisitors}</ProfileLatestVisitor> : ''
      }
    </div>
  );
};

export default Sidemenu;
