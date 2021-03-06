import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function PreviewResume({
  name,
  age,
  picture,
  intro,
  jobTitle,
  workExperiences = [],
  links = [],
  skills = [],
}) {
  return (
    <>
      <section className="bg-yellow-400">
        <div className="container px-12 py-12 border-b flex flex-col lg:flex-row">
          <div className="flex justify-center mb-8">
            {picture && (
              <div className="aspect-square rounded-full bg-gray-100 h-[100px] min-h-[100px] mr-12 overflow-hidden">
                <Image src={picture} alt={name} height={100} width={100} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{name}</h1>
            <h3 className="mb-2 font-medium">{jobTitle}</h3>
            <p className="mb-2 font-light">{age ? `${age} years old` : ''}</p>
            <p className="text-sm bg-blend-difference">{intro}</p>
            <div className="my-4 flex gap-2">
              {links.map(({ label, url }, i) => label && (
                <a
                  href={url}
                  key={i}
                  data-testid="links"
                  target="_blank"
                  className="text-black py-1 px-2 border border-black hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                  rel="noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container px-12">
        {workExperiences?.length > 0 && (
        <section className="py-8">
          <h2 className="mb-6">Work Experiences</h2>
          <div>
            {workExperiences?.map((exp, i) => (
              <div key={i} data-testid="workExperiences" className="flex mb-4">
                <div>
                  <div className="aspect-square rounded-full bg-gray-100 h-[50px] mr-4 overflow-hidden">
                    <Image src={exp.companyLogo} alt={exp.company} height={50} width={50} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{exp.company}</p>
                  <p className="text-sm font-light">{exp.jobTitle}</p>
                  <p className="text-sm font-light my-2 text-gray-500">
                    {exp.startDate}
                    {' '}
                    -
                    {' '}
                    {exp.endDate || 'Present'}
                  </p>
                  <p className="text-sm font-light whitespace-pre-line">
                    {exp.jobDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        <section className="py-8">
          {skills?.length > 0 && (
          <h2 className="mb-4">Skills</h2>
          )}
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, i) => (
              <span key={i} className="py-1 px-2 rounded-lg bg-gray-100">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

PreviewResume.defaultProps = {
  name: '',
  picture: '',
  age: '',
  intro: '',
  jobTitle: '',
  workExperiences: [],
  links: [],
  skills: [],
};

PreviewResume.propTypes = {
  name: PropTypes.string,
  picture: PropTypes.string,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  intro: PropTypes.string,
  jobTitle: PropTypes.string,
  workExperiences: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    companyLogo: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    jobTitle: PropTypes.string.isRequired,
    jobDescription: PropTypes.string.isRequired,
  })),
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
  skills: PropTypes.arrayOf(PropTypes.string),
};
