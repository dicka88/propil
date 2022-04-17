import React from 'react';
import Head from 'next/head';

import { getResumeByUsername } from '../../services/resume.service';
import PreviewResume from '../../components/PreviewResume';

function Username({ data }) {
  return (
    <div className="mx-auto">
      <Head>
        <title>{data.name}</title>
        <link rel="icon" type="image/png" href={data.picture} />
      </Head>
      <PreviewResume
        name={data.name}
        age={data.age}
        picture={data.picture}
        intro={data.intro}
        jobtitle={data.jobTitle}
        workExperiences={data.workExperiences}
        links={data.links}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const resume = await getResumeByUsername(username);

  if (!resume) {
    return {
      notFound: true
    };
  }

  // if profile is public then show the page

  // if profile is private and is auth session == username then show the page with banner (only you can show this page)

  // if profile is private then show 404
  // return {
  //   notFound: true
  // };

  return {
    props: {
      data: resume
    }
  };
}

export default Username;