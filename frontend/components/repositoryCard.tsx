import type { NextPage } from 'next';

import { RespositoryInterface } from '@/store/githubAccountSlice';

const LANGUAGE_COLORS : any = {
  C: 'border-red-300  bg-red-200 ',
  'C++': 'border-pink-300  bg-pink-200 ',
  'C#': 'border-purple-300  bg-purple-200 ',
  Go: 'border-indigo-300  bg-indigo-200 ',
  Java: 'border-blue-300  bg-blue-200 ',
  JavaScript: 'border-yellow-300  bg-yellow-200 ',
  PHP: 'border-orange-300  bg-orange-200 ',
  Python: 'border-green-300  bg-green-200 ',
  Ruby: 'border-orange-300  bg-orange-200 ',
  HTML: 'border-blue-300  bg-blue-200 ',
  Scala: 'border-brown-300  bg-brown-200 ',
  CSS: 'border-orange-300  bg-orange-200 ',
  Dockerfile: 'border-indigo-300  bg-indigo-200 ',
  TypeScript: 'border-green-300  bg-green-200 ',
};

const RepositoryCard: NextPage<RespositoryInterface> = (
  repository: RespositoryInterface,
) => {
  let visibilityClass = 'border-gray-400 bg-gray-100 text-base text-gray-700';
  let visibilityLabel = 'private';
  if (!repository.private) {
    visibilityClass =
      'border-purple-400 bg-purple-100 text-base text-purple-700';
    visibilityLabel = 'public';
  }

  let languageClass: any = "border-gray-300  bg-gray-200"
  if (LANGUAGE_COLORS[repository.language]) {
    languageClass = LANGUAGE_COLORS[repository.language]
  }

  return (
    <div className=" bg-gray-50 border-gray-200 rounded-lg mb-5 p-5">
      <div className="flex">
        <div className="font-semibold text-gray-900">{repository.name}</div>
        <div
          className={`flex justify-center items-center m-1 px-1 py-1 border rounded-full ${visibilityClass} font-medium w-15`}
        >
          <div className="flex-initial max-w-full leading-none text-xs font-medium">
            {visibilityLabel}
          </div>
        </div>
      </div>

      <div className="mb-4 mt-2">{repository.description}</div>

      <div className="flex text-sm">
        {repository.language ? (
          <div className="flex mr-5">
            <div className={`flex justify-center items-center m-1 mt-1 p-1 border rounded-full ${languageClass} font-medium w-3 h-3`} />
            <span>{repository.language}</span>
          </div>
        ) : (
          ''
        )}

        <div>{repository.updated_at_display}</div>
      </div>
    </div>
  );
};

export default RepositoryCard;
