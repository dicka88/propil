import React from 'react';
import Head from 'next/head';
import Cookie from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

import { getResumeByUsername } from '../../services/resume.service';
import PreviewResume from '../../components/PreviewResume';

export default function Username({ resume, user }) {
  return (
    <div className="mx-auto">
      <Head>
        <title>{resume.name}</title>
        <link rel="icon" type="image/png" href={resume.picture} />
      </Head>
      {!resume.isPublic && resume.user_id === user.user_id && (
        <div className="bg-black text-white p-4 text-center">
          <p className="font-bold">
            Only you can see this page
          </p>
        </div>
      )}
      <PreviewResume
        name={resume.name}
        age={resume.age}
        picture={resume.picture}
        intro={resume.intro}
        jobTitle={resume.jobTitle}
        workExperiences={resume.workExperiences}
        links={resume.links}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const { cookie } = context.req.headers;

  const uCookie = new Cookie(cookie);
  const token = uCookie.get('token');
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      // console.eror(err);
    }
  }

  const resume = await getResumeByUsername(username);

  if (!resume) {
    return {
      notFound: true,
    };
  }

  // if resume is private and is not their own then return 404
  if (!resume.isPublic && resume.user_id !== user?.user_id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
      resume,
    },
  };
}

Username.propTypes = {
  resume: PropTypes.objectOf({
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
  }).isRequired,
  user: PropTypes.object.isRequired,
};
