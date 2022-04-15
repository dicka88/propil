import React from 'react';
import PropTypes from 'prop-types';

export default function PreviewResume({
  name,
  age,
  picture,
  intro,
  jobtitle,
  workExperiences = [],
  links = []
}) {
  console.log(workExperiences);
  return (
    <>
      <section className="container px-12 py-8 border-b bg-yellow-400">
        <div className="flex flex-col lg:flex-row">
          <div className="flex lg:justify-center">
            {picture && (
              <div className="aspect-square rounded-full bg-gray-100 h-[100px] min-h-[100px] mr-6 overflow-hidden">
                <img src={picture} alt={name} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl">{name}</h1>
            <p className="mb-2 font-light">{age ? `${age} years old` : ''}</p>
            <p className="mb-2 font-medium">{jobtitle}</p>
            <p className="text-sm bg-blend-difference">{intro}</p>
            <div className="my-4 flex gap-2">
              {links.map(({ label, url }) =>
                <a href={url} className="text-white py-1 px-2 border border-white hover:bg-black hover:text-white hover:border-black transition-colors duration-300">
                  {label}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container px-12">
        <section className="py-8">
          {workExperiences?.length > 0 && (
            <h2 className="mb-4">Work Experiences</h2>
          )}
          <div>
            {workExperiences?.map(exp => (
              <div className="flex mb-4">
                <div className="aspect-square rounded-full bg-gray-100 h-[50px] mr-4 overflow-hidden">
                  <img src={exp.companyLogo} alt={exp.company} />
                </div>
                <div>
                  <p className="font-semibold">{exp.company}</p>
                  <p className='text-sm font-light'>{exp.jobTitle}</p>
                  <p className='text-sm font-light my-2 text-gray-500'>{exp.startDate} - {exp.endDate || "Present"}</p>
                  <p className="text-sm font-light">
                    {exp.jobDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

PreviewResume.propTypes = {
  name: PropTypes.string,
  picture: PropTypes.string,
  age: PropTypes.number,
  intro: PropTypes.string,
  jobtitle: PropTypes.string,
  workExperiences: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    companyLogo: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    jobDescription: PropTypes.string.isRequired
  })),
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }))
};
