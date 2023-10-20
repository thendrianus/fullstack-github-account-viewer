import type { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';

import { gitHubLogin } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const GithubLoginOauthAuthorize: NextPage = () => {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  if (codeParam) {
    dispatch(gitHubLogin({ codeParam })).then((res: any) => {
      if (res.payload.status) {
        router.push('/' + res.payload.data.githubUsername);
      }
    });
  }

  return (
    <div className="w-full h-full text-center p-20">
      <div
        className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
      </div>
      <div>
        {codeParam ? (
          'Processing...'
        ) : (
          <div>
            Github code is incorrect <br />
            Redirecting to home ...
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubLoginOauthAuthorize;
