import type { NextComponentType } from 'next';
import RepositoryCard from './repositoryCard';
import {
  selectGithubAccountState,
  RespositoryInterface
} from '@/store/githubAccountSlice';
import { useSelector } from 'react-redux';

const MainContent: NextComponentType = () => {
  const githubAccountState = useSelector(selectGithubAccountState);
  console.log(githubAccountState.repository.data)
  const repositories = githubAccountState.repository.data.map((repository : RespositoryInterface , idx : number) => {
    return <RepositoryCard {...repository} key={idx}/>
  })

  const repositoriesLength = githubAccountState.repository.data.length;
  return (
    <div className='mt-5 bg-white rounded-lg lg:px-5 pb-1'>
      <div className='py-5'>
        <div className='flex'>
          <div className='leading-8 mr-2 text-lg'><b>Repository</b></div>
          <div className="flex justify-center items-center m-1 px-1 py-1 border border-gray-200 rounded-full bg-gray-100 text-base text-gray-700 font-medium w-6">
            <div className="flex-initial max-w-full leading-none text-xs font-normal">{repositoriesLength}</div>
          </div>
        </div>
      </div>
      {repositories}
    </div>
  )
}


export default MainContent;
